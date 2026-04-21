import type { Severity } from "@/generated/prisma/client";
import type { Scraper, ScraperResult, ScrapedItem } from "./types";

function mapSeverity(severity: string): Severity {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return "CRITICAL";
    case "HIGH":
      return "HIGH";
    case "MODERATE":
    case "MEDIUM":
      return "MEDIUM";
    case "LOW":
      return "LOW";
    default:
      return "INFO";
  }
}

interface GitHubRestAdvisory {
  ghsa_id: string;
  cve_id: string | null;
  summary: string;
  description: string;
  severity: string;
  published_at: string;
  updated_at: string;
  html_url: string;
  type: string;
  cvss: { score: number | null; vector_string: string | null } | null;
  vulnerabilities: {
    package: { ecosystem: string; name: string } | null;
    vulnerable_version_range: string | null;
    first_patched_version: string | null;
  }[];
}

export class GitHubAdvisoriesScraper implements Scraper {
  name = "github-advisories";
  url = "https://github.com/advisories";

  async scrape(): Promise<ScraperResult> {
    try {
      return await this.scrapeRestApi();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return { items: [], error: `GitHub Advisories scrape failed: ${msg}` };
    }
  }

  /**
   * Uses the public GitHub REST API for security advisories.
   * Works without authentication (60 requests/hour unauthenticated, 5000 with token).
   * Fetches the latest 100 advisories sorted by published date.
   */
  private async scrapeRestApi(): Promise<ScraperResult> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "BreachSignal/1.0",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Use token if available for higher rate limits
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Fetch latest advisories (sorted by published desc by default)
    const url = new URL("https://api.github.com/advisories");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("sort", "published");
    url.searchParams.set("direction", "desc");
    url.searchParams.set("type", "reviewed");

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        items: [],
        error: `GitHub REST API returned ${response.status}: ${text.slice(0, 200)}`,
      };
    }

    const advisories: GitHubRestAdvisory[] = await response.json();
    const items: ScrapedItem[] = [];

    for (const advisory of advisories) {
      if (!advisory.ghsa_id) continue;

      const cvssScore = advisory.cvss?.score || null;
      const cveId = advisory.cve_id || null;

      if (!advisory.vulnerabilities || advisory.vulnerabilities.length === 0) {
        // Advisory without specific package vulnerabilities
        items.push({
          externalId: `ghsa-${advisory.ghsa_id}`,
          type: "VULNERABILITY",
          title: advisory.summary || `Security Advisory ${advisory.ghsa_id}`,
          description: (advisory.description || advisory.summary || "").slice(0, 2000),
          severity: mapSeverity(advisory.severity),
          sourceUrl: advisory.html_url,
          publishedAt: new Date(advisory.published_at),
          metadata: { cvssScore, cveId, ghsaId: advisory.ghsa_id },
        });
        continue;
      }

      for (const vuln of advisory.vulnerabilities) {
        const pkg = vuln.package;
        const externalId = pkg
          ? `ghsa-${advisory.ghsa_id}-${pkg.ecosystem}-${pkg.name}`
          : `ghsa-${advisory.ghsa_id}`;

        items.push({
          externalId,
          type: "VULNERABILITY",
          title: advisory.summary || `Security Advisory ${advisory.ghsa_id}`,
          description: (advisory.description || advisory.summary || "").slice(0, 2000),
          severity: mapSeverity(advisory.severity),
          packageName: pkg?.name || undefined,
          ecosystem: pkg?.ecosystem?.toLowerCase() || undefined,
          sourceUrl: advisory.html_url,
          publishedAt: new Date(advisory.published_at),
          metadata: {
            cvssScore,
            cveId,
            ghsaId: advisory.ghsa_id,
            affectedVersions: vuln.vulnerable_version_range || "unknown",
            patchedVersion: vuln.first_patched_version || null,
          },
        });
      }
    }

    return { items };
  }
}
