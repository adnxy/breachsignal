import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface GitHubRestAdvisory {
  ghsa_id: string;
  cve_id: string | null;
  summary: string;
  description: string;
  severity: string;
  published_at: string;
  html_url: string;
  vulnerabilities: {
    package: { ecosystem: string; name: string } | null;
    vulnerable_version_range: string | null;
    first_patched_version: string | null;
  }[];
}

function mapSeverity(severity: string): string {
  switch (severity?.toUpperCase()) {
    case "CRITICAL": return "CRITICAL";
    case "HIGH": return "HIGH";
    case "MODERATE":
    case "MEDIUM": return "MEDIUM";
    case "LOW": return "LOW";
    default: return "INFO";
  }
}

/**
 * Fetches latest advisories directly from GitHub REST API.
 * Used as the primary data source so we always show fresh data.
 */
async function fetchGitHubAdvisories(params: {
  severity?: string | null;
  search?: string | null;
  limit: number;
}) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "BreachSignal/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = new URL("https://api.github.com/advisories");
  url.searchParams.set("per_page", String(Math.min(params.limit, 100)));
  url.searchParams.set("sort", "published");
  url.searchParams.set("direction", "desc");
  url.searchParams.set("type", "reviewed");

  if (params.severity) {
    url.searchParams.set("severity", params.severity.toLowerCase());
  }

  const response = await fetch(url.toString(), {
    headers,
    next: { revalidate: 60 }, // cache for 60s
  });

  if (!response.ok) {
    return [];
  }

  const advisories: GitHubRestAdvisory[] = await response.json();
  const items: {
    id: string;
    type: string;
    title: string;
    description: string;
    severity: string;
    packageName: string | null;
    ecosystem: string | null;
    sourceUrl: string | null;
    publishedAt: string;
    source: { name: string; url: string };
  }[] = [];

  for (const advisory of advisories) {
    if (!advisory.ghsa_id) continue;

    const title = advisory.summary || `Security Advisory ${advisory.ghsa_id}`;
    const description = (advisory.description || advisory.summary || "").slice(0, 500);
    const severity = mapSeverity(advisory.severity);

    if (!advisory.vulnerabilities || advisory.vulnerabilities.length === 0) {
      items.push({
        id: `ghsa-${advisory.ghsa_id}`,
        type: "VULNERABILITY",
        title,
        description,
        severity,
        packageName: null,
        ecosystem: null,
        sourceUrl: advisory.html_url,
        publishedAt: advisory.published_at,
        source: { name: "GitHub Advisories", url: "https://github.com/advisories" },
      });
      continue;
    }

    for (const vuln of advisory.vulnerabilities) {
      const pkg = vuln.package;
      items.push({
        id: pkg
          ? `ghsa-${advisory.ghsa_id}-${pkg.ecosystem}-${pkg.name}`
          : `ghsa-${advisory.ghsa_id}`,
        type: "VULNERABILITY",
        title,
        description,
        severity,
        packageName: pkg?.name || null,
        ecosystem: pkg?.ecosystem?.toLowerCase() || null,
        sourceUrl: advisory.html_url,
        publishedAt: advisory.published_at,
        source: { name: "GitHub Advisories", url: "https://github.com/advisories" },
      });
    }
  }

  // Apply client-side search filter if specified
  if (params.search) {
    const q = params.search.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.packageName && item.packageName.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q)
    );
  }

  return items;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const severity = searchParams.get("severity");
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const source = searchParams.get("source");
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") || "30"), 100);

  // Try fetching from DB first
  try {
    const where: Record<string, unknown> = {};

    if (severity) where.severity = severity.toUpperCase();
    if (type) where.type = type.toUpperCase();
    if (source) where.source = { name: source };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { packageName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (cursor) where.id = { lt: cursor };

    const items = await db.feedItem.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit + 1,
      include: { source: { select: { name: true, url: true } } },
    });

    if (items.length > 0) {
      const hasMore = items.length > limit;
      const results = hasMore ? items.slice(0, limit) : items;
      const nextCursor = hasMore ? results[results.length - 1].id : null;

      return NextResponse.json({ items: results, nextCursor, hasMore });
    }
  } catch {
    // DB not available — fall through to GitHub API
  }

  // Fallback: fetch directly from GitHub Advisories API
  const items = await fetchGitHubAdvisories({ severity, search, limit });

  return NextResponse.json({
    items,
    nextCursor: null,
    hasMore: false,
  });
}
