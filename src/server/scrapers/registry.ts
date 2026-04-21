import type { ScraperRegistryEntry } from "./types";
import { GitHubAdvisoriesScraper } from "./github-advisories";
import { BreachSenseScraper } from "./breachsense";

/**
 * Central registry of all scrape sources.
 *
 * To add a new scraper:
 * 1. Create a new file in src/server/scrapers/ implementing the Scraper interface
 * 2. Add an entry here with name, url, interval, and factory function
 * 3. Run `npx prisma db push` — the ScrapeSource row is auto-created on first run
 */
export const SCRAPER_REGISTRY: ScraperRegistryEntry[] = [
  {
    name: "github-advisories",
    url: "https://github.com/advisories",
    intervalMs: 5 * 60 * 1000, // 5 minutes
    create: () => new GitHubAdvisoriesScraper(),
  },
  {
    name: "breachsense",
    url: "https://www.breachsense.com/breaches/",
    intervalMs: 10 * 60 * 1000, // 10 minutes
    create: () => new BreachSenseScraper(),
  },
  // ──────────────────────────────────────────────
  // Add new scrapers here:
  //
  // {
  //   name: "nvd",
  //   url: "https://nvd.nist.gov/vuln/search",
  //   intervalMs: 15 * 60 * 1000,
  //   create: () => new NvdScraper(),
  // },
  // ──────────────────────────────────────────────
];
