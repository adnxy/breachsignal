"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_STATS, MOCK_ALERTS } from "@/lib/constants";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { TimeAgo } from "@/components/shared/time-ago";
import { AlertsChart } from "@/components/dashboard/alerts-chart";
import { PackageHealth } from "@/components/dashboard/package-health";
import { Package, AlertTriangle, ShieldAlert, Plug, ArrowRight, Activity, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardData {
  stats: { totalPackages: number; activeAlerts: number; criticalIssues: number; integrationsConnected: number };
  alertsPerDay: { date: string; count: number }[];
  severityBreakdown: { critical: number; high: number; medium: number; low: number };
  recentAlerts: { id: string; packageName: string; title: string; severity: string; status: string; detectedAt: string; sourceUrl: string }[];
}

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) setData(await res.json());
      } catch {}
    }
    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, []);

  const stats = data?.stats || MOCK_STATS;
  const alerts = data?.recentAlerts || MOCK_ALERTS.slice(0, 5).map((a) => ({
    id: a.id, packageName: a.packageName, title: a.title, severity: a.severity,
    status: a.status, detectedAt: a.detectedAt.toISOString(), sourceUrl: a.sourceUrl,
  }));
  const severityBreakdown = data?.severityBreakdown || { critical: 3, high: 5, medium: 8, low: 2 };

  // Empty state — no packages tracked yet
  if (data && data.stats.totalPackages === 0) {
    return (
      <div className="space-y-6">
        <div className={cn("transition-all duration-500", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
          <PageHeader title="Overview" description="Your security posture at a glance." />
        </div>

        <div className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-border bg-card shadow-sm py-24 px-6 text-center transition-all duration-500",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        )}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 mb-5">
            <Package className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-semibold tracking-tight">Start monitoring your packages</h2>
          <p className="mt-2 max-w-sm text-[14px] text-muted-foreground leading-relaxed">
            Add the packages you depend on and we&apos;ll alert you instantly when new vulnerabilities are disclosed.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <Link href="/dashboard/packages">
              <Button size="sm" className="h-9 px-5 text-[13px] font-medium">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Package
              </Button>
            </Link>
            <Link href="/dashboard/packages">
              <Button variant="outline" size="sm" className="h-9 px-5 text-[13px] font-medium">
                <Upload className="mr-2 h-4 w-4" />
                Upload package.json
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-[11px] text-muted-foreground">
            You can also browse the <Link href="/dashboard/feed" className="underline hover:text-foreground transition-colors">live feed</Link> to see the latest security advisories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={cn("transition-all duration-500", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
        <PageHeader title="Overview" description="Your security posture at a glance." />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Tracked Packages", value: stats.totalPackages, icon: Package, sparkData: [120, 125, 130, 128, 135, 140, stats.totalPackages] },
          { title: "Active Alerts", value: stats.activeAlerts, icon: AlertTriangle, trend: { value: 8, label: "vs last week" }, sparkData: [5, 8, 6, 10, 9, 14, stats.activeAlerts] },
          { title: "Critical Issues", value: stats.criticalIssues, icon: ShieldAlert, trend: { value: -25, label: "vs last week" }, sparkData: [6, 5, 7, 4, 5, 4, stats.criticalIssues] },
          { title: "Integrations", value: stats.integrationsConnected, icon: Plug },
        ].map((card, i) => (
          <div
            key={card.title}
            className={cn("transition-all duration-500 ease-out", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
            style={{ transitionDelay: mounted ? `${i * 80}ms` : "0ms" }}
          >
            <StatCard {...card} />
          </div>
        ))}
      </div>

      {/* Chart + Severity */}
      <div className={cn(
        "grid gap-4 lg:grid-cols-5 transition-all duration-500 ease-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )} style={{ transitionDelay: mounted ? "300ms" : "0ms" }}>
        <Card className="lg:col-span-3 border-border shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
                </div>
                <CardTitle className="text-[14px] font-semibold tracking-tight">Alerts This Week</CardTitle>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.06em]">7 days</span>
            </div>
          </CardHeader>
          <CardContent>
            <AlertsChart data={data?.alertsPerDay} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-[14px] font-semibold tracking-tight">Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <SeverityBreakdown counts={severityBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Package Health + Recent Alerts */}
      <div className={cn(
        "grid gap-4 lg:grid-cols-5 transition-all duration-500 ease-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )} style={{ transitionDelay: mounted ? "450ms" : "0ms" }}>
        <Card className="lg:col-span-2 border-border shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[14px] font-semibold tracking-tight">Package Health</CardTitle>
              <Link href="/dashboard/packages" className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group">
                View all <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PackageHealth />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[14px] font-semibold tracking-tight">Recent Alerts</CardTitle>
              <Link href="/dashboard/alerts" className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group">
                View all <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 pb-2.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Package</th>
                  <th className="px-3 pb-2.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Issue</th>
                  <th className="px-3 pb-2.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Severity</th>
                  <th className="px-3 pb-2.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-6 pb-2.5 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">When</th>
                </tr>
              </thead>
              <tbody>
                {alerts.slice(0, 5).map((alert, i) => (
                  <tr
                    key={alert.id}
                    className={cn(
                      "group transition-colors duration-150 hover:bg-muted/40 cursor-default",
                      i < 4 && "border-b border-border/60"
                    )}
                  >
                    <td className="px-6 py-3.5">
                      <a
                        href={`https://www.npmjs.com/package/${alert.packageName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono font-semibold bg-muted group-hover:bg-muted/80 px-2 py-0.5 rounded-md transition-colors duration-150 hover:underline"
                      >
                        {alert.packageName}
                      </a>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-[12px] text-muted-foreground group-hover:text-foreground line-clamp-1 transition-colors duration-150">{alert.title}</span>
                    </td>
                    <td className="px-3 py-3.5"><SeverityBadge severity={alert.severity as "critical" | "high" | "medium" | "low"} /></td>
                    <td className="px-3 py-3.5"><StatusBadge status={alert.status as "new" | "acknowledged" | "resolved" | "ignored"} /></td>
                    <td className="px-6 py-3.5 text-right text-[11px] text-muted-foreground group-hover:text-foreground/70 font-medium tabular-nums transition-colors duration-150"><TimeAgo date={new Date(alert.detectedAt)} /></td>
                  </tr>
                ))}
                {alerts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[13px] text-muted-foreground">
                      No alerts yet. Add packages to start monitoring.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SeverityBreakdown({ counts }: { counts: { critical: number; high: number; medium: number; low: number } }) {
  const [hoveredSev, setHoveredSev] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const severities = [
    { key: "critical", label: "Critical", count: counts.critical, cssVar: "--severity-critical" },
    { key: "high", label: "High", count: counts.high, cssVar: "--severity-high" },
    { key: "medium", label: "Medium", count: counts.medium, cssVar: "--severity-medium" },
    { key: "low", label: "Low", count: counts.low, cssVar: "--severity-low" },
  ];

  return (
    <div className="space-y-5" onMouseLeave={() => setHoveredSev(null)}>
      {/* Horizontal stacked bar */}
      <div className="h-[8px] rounded-full bg-muted overflow-hidden flex gap-[2px]">
        {severities.map((sev, i) => {
          const pct = (sev.count / total) * 100;
          if (pct === 0) return null;
          const isHovered = hoveredSev === sev.key;
          return (
            <div
              key={sev.key}
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out cursor-default",
                isHovered ? "opacity-100" : hoveredSev ? "opacity-40" : "opacity-85"
              )}
              style={{
                width: animated ? `${pct}%` : "0%",
                transitionDelay: animated ? "0ms" : `${i * 100}ms`,
                backgroundColor: `var(${sev.cssVar})`,
              }}
              onMouseEnter={() => setHoveredSev(sev.key)}
            />
          );
        })}
      </div>

      {/* Legend rows */}
      <div className="space-y-0.5">
        {severities.map((sev) => {
          const pct = Math.round((sev.count / total) * 100);
          const isHovered = hoveredSev === sev.key;
          return (
            <div
              key={sev.key}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 -mx-3 transition-all duration-200 cursor-default",
                isHovered ? "bg-muted/60" : "bg-transparent"
              )}
              onMouseEnter={() => setHoveredSev(sev.key)}
            >
              <div
                className={cn("h-[8px] w-[8px] rounded-full transition-transform duration-200", isHovered && "scale-[1.3]")}
                style={{ backgroundColor: `var(${sev.cssVar})` }}
              />
              <span className={cn(
                "text-[12px] font-medium flex-1 transition-colors duration-150",
                isHovered ? "text-foreground" : "text-foreground/70"
              )}>
                {sev.label}
              </span>
              <span className={cn(
                "text-[10px] font-semibold tabular-nums transition-all duration-150 w-[32px] text-right",
                isHovered ? "text-muted-foreground" : "text-muted-foreground/70"
              )}>
                {pct}%
              </span>
              <span className={cn(
                "text-[13px] font-bold tabular-nums w-[24px] text-right transition-all duration-200",
                isHovered ? "text-foreground" : "text-foreground/80"
              )}>
                {sev.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
