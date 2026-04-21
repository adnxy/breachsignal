import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { SCRAPER_REGISTRY } from "./registry";
import { sendNotifications } from "../notifications";
import type { ScrapedItem } from "./types";

interface ScrapeRunResult {
  source: string;
  newItems: number;
  skipped: number;
  alertsCreated: number;
  error?: string;
  durationMs: number;
}

/**
 * Runs all due scrapers, ingests new items, matches against subscriptions,
 * creates alerts, and dispatches notifications.
 *
 * Designed to be called from a cron endpoint every 1-2 minutes.
 * Each source has its own interval — we skip sources that aren't due yet.
 */
export async function runScrapeEngine(): Promise<ScrapeRunResult[]> {
  const results: ScrapeRunResult[] = [];

  for (const entry of SCRAPER_REGISTRY) {
    // Ensure source exists in DB
    const source = await db.scrapeSource.upsert({
      where: { name: entry.name },
      update: { url: entry.url, intervalMs: entry.intervalMs },
      create: {
        name: entry.name,
        url: entry.url,
        intervalMs: entry.intervalMs,
        enabled: true,
      },
    });

    if (!source.enabled) continue;

    // Check if source is due for scraping
    if (source.lastScrapedAt) {
      const elapsed = Date.now() - source.lastScrapedAt.getTime();
      if (elapsed < source.intervalMs) continue;
    }

    const start = Date.now();
    const scraper = entry.create();

    try {
      const { items, error } = await scraper.scrape();

      if (error) {
        await db.scrapeSource.update({
          where: { id: source.id },
          data: { lastScrapedAt: new Date(), lastStatus: "error", lastError: error },
        });
        results.push({ source: entry.name, newItems: 0, skipped: 0, alertsCreated: 0, error, durationMs: Date.now() - start });
        continue;
      }

      const { newItems, skipped } = await ingestItems(source.id, items);
      const alertsCreated = await matchAndAlert(items.filter((_, i) => i < newItems));

      await db.scrapeSource.update({
        where: { id: source.id },
        data: {
          lastScrapedAt: new Date(),
          lastStatus: "success",
          lastError: null,
          itemsFound: source.itemsFound + newItems,
        },
      });

      results.push({ source: entry.name, newItems, skipped, alertsCreated, durationMs: Date.now() - start });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      await db.scrapeSource.update({
        where: { id: source.id },
        data: { lastScrapedAt: new Date(), lastStatus: "error", lastError: errorMsg },
      });
      results.push({ source: entry.name, newItems: 0, skipped: 0, alertsCreated: 0, error: errorMsg, durationMs: Date.now() - start });
    }
  }

  return results;
}

/**
 * Ingest scraped items into the feed_items table + advisories table.
 * Deduplicates by externalId.
 */
async function ingestItems(sourceId: string, items: ScrapedItem[]): Promise<{ newItems: number; skipped: number }> {
  let newItems = 0;
  let skipped = 0;

  for (const item of items) {
    // Check if already exists
    const existing = await db.feedItem.findUnique({
      where: { externalId: item.externalId },
    });

    if (existing) {
      skipped++;
      continue;
    }

    // Insert into feed
    await db.feedItem.create({
      data: {
        sourceId,
        externalId: item.externalId,
        type: item.type,
        title: item.title,
        description: item.description,
        severity: item.severity,
        packageName: item.packageName || null,
        ecosystem: item.ecosystem || null,
        sourceUrl: item.sourceUrl || null,
        metadata: item.metadata as unknown as Prisma.InputJsonValue ?? undefined,
        publishedAt: item.publishedAt,
      },
    });

    // Also upsert into advisories table if it's a package-specific vulnerability
    if (item.packageName && item.type === "VULNERABILITY") {
      const advisoryExternalId = item.externalId;
      const existingAdvisory = await db.advisory.findUnique({
        where: { externalId: advisoryExternalId },
      });

      if (!existingAdvisory) {
        const meta = item.metadata as Record<string, unknown> | undefined;
        await db.advisory.create({
          data: {
            externalId: advisoryExternalId,
            packageName: item.packageName,
            ecosystem: item.ecosystem || "npm",
            title: item.title,
            summary: item.description.slice(0, 2000),
            severity: item.severity,
            affectedVersions: (meta?.affectedVersions as string) || "unknown",
            patchedVersions: (meta?.patchedVersion as string) || null,
            publishedAt: item.publishedAt,
            sourceUrl: item.sourceUrl || "",
            cvssScore: (meta?.cvssScore as number) || null,
            cveId: (meta?.cveId as string) || null,
          },
        });
      }
    }

    newItems++;
  }

  return { newItems, skipped };
}

/**
 * Match new items against user package subscriptions.
 * Creates alerts and sends notifications for affected packages.
 */
async function matchAndAlert(newItems: ScrapedItem[]): Promise<number> {
  let alertsCreated = 0;

  // Get all package names from new items
  const packageNames = [...new Set(newItems.filter((i) => i.packageName).map((i) => i.packageName!))];

  if (packageNames.length === 0) return 0;

  // Find all subscriptions for affected packages (batch query)
  const subscriptions = await db.packageSubscription.findMany({
    where: {
      packageName: { in: packageNames },
      muted: false,
    },
    include: { user: true },
  });

  if (subscriptions.length === 0) return 0;

  // For each new item that affects a subscribed package, create alert
  for (const item of newItems) {
    if (!item.packageName) continue;

    const affectedSubs = subscriptions.filter((s) => s.packageName === item.packageName);

    for (const sub of affectedSubs) {
      // Find the advisory (if it was created)
      const advisory = await db.advisory.findUnique({
        where: { externalId: item.externalId },
      });

      if (!advisory) continue;

      // Check for duplicate alert
      const existingAlert = await db.alert.findFirst({
        where: { userId: sub.userId, advisoryId: advisory.id },
      });

      if (existingAlert) continue;

      // Create alert
      const alert = await db.alert.create({
        data: {
          userId: sub.userId,
          advisoryId: advisory.id,
          packageSubscriptionId: sub.id,
        },
      });

      alertsCreated++;

      // Fire notifications asynchronously (don't block the loop)
      sendNotifications({
        userId: sub.userId,
        alertId: alert.id,
        title: item.title,
        summary: item.description.slice(0, 500),
        severity: item.severity,
        packageName: item.packageName,
        sourceUrl: item.sourceUrl || "",
      }).catch((err) => {
        console.error(`Notification failed for alert ${alert.id}:`, err);
      });
    }
  }

  return alertsCreated;
}
