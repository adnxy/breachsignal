import type { Severity } from "@/generated/prisma/client";

export interface ScrapedItem {
  externalId: string;
  type: string;
  title: string;
  description: string;
  severity: Severity;
  packageName?: string;
  ecosystem?: string;
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
  publishedAt: Date;
}

export interface ScraperResult {
  items: ScrapedItem[];
  error?: string;
}

export interface Scraper {
  name: string;
  url: string;
  scrape(): Promise<ScraperResult>;
}

export interface ScraperRegistryEntry {
  name: string;
  url: string;
  intervalMs: number;
  create: () => Scraper;
}
