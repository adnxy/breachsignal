/**
 * Legacy scraper functions — now delegates to the unified scrape engine.
 * Kept for backward compatibility with any direct imports.
 */

export { runScrapeEngine as scrapeGitHubAdvisories } from "./scrapers/engine";

export async function matchAdvisoriesToSubscriptions() {
  // Matching is now done automatically inside runScrapeEngine.
  // This is a no-op for backward compatibility.
  return { alertsCreated: 0 };
}
