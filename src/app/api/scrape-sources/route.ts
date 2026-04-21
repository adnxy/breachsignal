import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { runScrapeEngine } from "@/server/scrapers";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sources = await db.scrapeSource.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      url: true,
      enabled: true,
      intervalMs: true,
      lastScrapedAt: true,
      lastStatus: true,
      lastError: true,
      itemsFound: true,
    },
  });

  return NextResponse.json({ sources });
}

/**
 * POST /api/scrape-sources — manually trigger a scrape run.
 * Forces all scrapers to run regardless of their interval timer.
 */
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Reset lastScrapedAt to force all sources to run
  await db.scrapeSource.updateMany({
    data: { lastScrapedAt: null },
  });

  try {
    const results = await runScrapeEngine();
    const totalNew = results.reduce((sum, r) => sum + r.newItems, 0);
    const errors = results.filter((r) => r.error);

    return NextResponse.json({
      success: true,
      summary: {
        sourcesRun: results.length,
        totalNewItems: totalNew,
        errors: errors.length,
      },
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Scrape failed", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
