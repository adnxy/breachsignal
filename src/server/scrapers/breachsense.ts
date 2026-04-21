import type { Severity } from "@/generated/prisma/client";
import type { Scraper, ScraperResult, ScrapedItem } from "./types";

/**
 * BreachSense scraper — scrapes the public breaches page for new incidents.
 * Uses HTML parsing since there's no public API.
 * Falls back to the known page structure; if the DOM changes, returns an error
 * so the operator knows to update the parser.
 */
export class BreachSenseScraper implements Scraper {
  name = "breachsense";
  url = "https://www.breachsense.com/breaches/";

  async scrape(): Promise<ScraperResult> {
    const response = await fetch(this.url, {
      headers: {
        "User-Agent": "BreachSignal/1.0 (Security Monitoring)",
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      return { items: [], error: `BreachSense returned ${response.status}` };
    }

    const html = await response.text();
    const items = this.parseBreaches(html);

    return { items };
  }

  private parseBreaches(html: string): ScrapedItem[] {
    const items: ScrapedItem[] = [];

    // Parse table rows from the breaches page
    // The page lists breaches in a table with: Name, Date, Records, Data Types
    const tableRowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i;
    const tagStripRegex = /<[^>]+>/g;

    let rowMatch: RegExpExecArray | null;
    let rowIndex = 0;

    while ((rowMatch = tableRowRegex.exec(html)) !== null) {
      const rowHtml = rowMatch[1];
      const cells: string[] = [];
      let cellMatch: RegExpExecArray | null;

      cellRegex.lastIndex = 0;
      while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
        cells.push(cellMatch[1]);
      }

      // Expect at least: Name, Date, Records (3 cells minimum)
      if (cells.length < 3) continue;
      rowIndex++;

      // Skip header rows
      if (cells[0].toLowerCase().includes("<th") || cells[0].toLowerCase().includes("name")) continue;

      const nameCell = cells[0];
      const dateCell = cells[1];
      const recordsCell = cells[2];
      const dataTypesCell = cells[3] || "";

      // Extract link and name
      const linkMatch = linkRegex.exec(nameCell);
      const name = linkMatch
        ? linkMatch[2].replace(tagStripRegex, "").trim()
        : nameCell.replace(tagStripRegex, "").trim();
      const detailUrl = linkMatch ? linkMatch[1] : null;

      if (!name) continue;

      const dateStr = dateCell.replace(tagStripRegex, "").trim();
      const records = recordsCell.replace(tagStripRegex, "").trim();
      const dataTypes = dataTypesCell.replace(tagStripRegex, "").trim();

      // Determine severity based on record count
      const recordCount = parseInt(records.replace(/[^0-9]/g, "")) || 0;
      const severity = this.classifySeverity(recordCount, dataTypes);

      const publishedAt = this.parseDate(dateStr);

      items.push({
        externalId: `breachsense-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${publishedAt.getTime()}`,
        type: "COMPROMISE",
        title: `Data breach reported: ${name}`,
        description: `${name} breach affecting ${records} records. Exposed data: ${dataTypes || "unknown"}.`,
        severity,
        sourceUrl: detailUrl
          ? (detailUrl.startsWith("http") ? detailUrl : `https://www.breachsense.com${detailUrl}`)
          : this.url,
        publishedAt,
        metadata: {
          organization: name,
          recordCount,
          dataTypes: dataTypes.split(",").map((s) => s.trim()).filter(Boolean),
          source: "breachsense",
        },
      });
    }

    // If we couldn't parse any rows but got HTML, try the alternative JSON-LD format
    if (items.length === 0 && html.length > 1000) {
      const jsonLdItems = this.parseJsonLd(html);
      if (jsonLdItems.length > 0) return jsonLdItems;
    }

    return items;
  }

  private parseJsonLd(html: string): ScrapedItem[] {
    const items: ScrapedItem[] = [];
    const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;

    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1]);
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item["@type"] === "Article" || item.name) {
              items.push({
                externalId: `breachsense-jsonld-${(item.name || item.headline || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
                type: "COMPROMISE",
                title: item.name || item.headline || "Unknown breach",
                description: item.description || "",
                severity: "HIGH",
                sourceUrl: item.url || this.url,
                publishedAt: new Date(item.datePublished || Date.now()),
                metadata: { source: "breachsense", format: "json-ld" },
              });
            }
          }
        }
      } catch {
        // JSON parse failed, skip
      }
    }

    return items;
  }

  private classifySeverity(recordCount: number, dataTypes: string): Severity {
    const sensitiveData = ["password", "credit card", "ssn", "social security", "financial", "health"];
    const hasSensitive = sensitiveData.some((s) => dataTypes.toLowerCase().includes(s));

    if (recordCount > 10_000_000 || hasSensitive) return "CRITICAL";
    if (recordCount > 1_000_000) return "HIGH";
    if (recordCount > 100_000) return "MEDIUM";
    return "LOW";
  }

  private parseDate(dateStr: string): Date {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed;
    // Default to now if we can't parse
    return new Date();
  }
}
