import { NextResponse } from "next/server";
import { runScrapeEngine } from "@/server/scrapers";

export const maxDuration = 60; // Allow up to 60s for scraping

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await runScrapeEngine();

    const totalNew = results.reduce((sum, r) => sum + r.newItems, 0);
    const totalAlerts = results.reduce((sum, r) => sum + r.alertsCreated, 0);
    const errors = results.filter((r) => r.error);

    return NextResponse.json({
      success: true,
      summary: {
        sourcesRun: results.length,
        totalNewItems: totalNew,
        totalAlerts,
        errors: errors.length,
      },
      results,
    });
  } catch (error) {
    console.error("Cron scrape engine error:", error);
    return NextResponse.json(
      { error: "Scrape engine failed", detail: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
