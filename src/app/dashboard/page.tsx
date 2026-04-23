"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_STATS, MOCK_ALERTS, MOCK_PROJECT_STATS, MOCK_PROJECT_SEVERITY } from "@/lib/constants";
import { useProject } from "@/lib/project-context";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { TimeAgo } from "@/components/shared/time-ago";
import { AlertsChart } from "@/components/dashboard/alerts-chart";
import { PackageHealth } from "@/components/dashboard/package-health";
import {
  Package, AlertTriangle, ShieldAlert, Shield, ArrowRight, Activity, Plus,
  ShieldCheck, Radio, GitBranch,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

interface DashboardData {
  stats: { totalPackages: number; activeAlerts: number; criticalIssues: number; integrationsConnected: number };
  alertsPerDay: { date: string; count: number }[];
  severityBreakdown: { critical: number; high: number; medium: number; low: number };
  recentAlerts: { id: string; packageName: string; title: string; severity: string; status: string; detectedAt: string; sourceUrl: string }[];
}

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [mounted, setMounted] = useState(false);
  const { project } = useProject();

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

  const projectStats = MOCK_PROJECT_STATS[project.id];
  const projectSeverity = MOCK_PROJECT_SEVERITY[project.id];

  const stats = data?.stats || projectStats || MOCK_STATS;
  const alerts = data?.recentAlerts || MOCK_ALERTS.slice(0, 5).map((a) => ({
    id: a.id, packageName: a.packageName, title: a.title, severity: a.severity,
    status: a.status, detectedAt: a.detectedAt.toISOString(), sourceUrl: a.sourceUrl,
  }));
  const severityBreakdown = data?.severityBreakdown || projectSeverity || { critical: 3, high: 5, medium: 8, low: 2 };

  if (data && data.stats.totalPackages === 0) {
    return (
      <div className={cn("transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-all duration-500",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
            {project.id !== "all" && (
              <span
                className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: project.color }}
              >
                {project.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.id === "all"
              ? "Your security posture at a glance."
              : `Security posture for ${project.name}.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/feed">
            <Button variant="outline" size="sm" className="h-8 text-sm">
              <Radio className="mr-1.5 h-3.5 w-3.5" />
              Live Feed
            </Button>
          </Link>
          <Link href="/dashboard/repositories">
            <Button variant="outline" size="sm" className="h-8 text-sm">
              <GitBranch className="mr-1.5 h-3.5 w-3.5" />
              Import
            </Button>
          </Link>
          <Link href="/dashboard/packages">
            <Button size="sm" className="h-8 text-sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Package
            </Button>
          </Link>
        </div>
      </div>

      {/* Security posture */}
      <div className={cn(
        "transition-all duration-500",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )} style={{ transitionDelay: "50ms" }}>
        <SecurityPosture stats={stats} />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Packages", value: stats.totalPackages, icon: Package, sparkData: [120, 125, 130, 128, 135, 140, stats.totalPackages] },
          { title: "Active Alerts", value: stats.activeAlerts, icon: AlertTriangle, trend: { value: 8, label: "vs last week" }, sparkData: [5, 8, 6, 10, 9, 14, stats.activeAlerts] },
          { title: "Critical", value: stats.criticalIssues, icon: ShieldAlert, trend: { value: -25, label: "vs last week" }, sparkData: [6, 5, 7, 4, 5, 4, stats.criticalIssues] },
          { title: "Integrations", value: stats.integrationsConnected, icon: Shield },
        ].map((card, i) => (
          <div
            key={card.title}
            className={cn("transition-all duration-500 ease-out", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}
            style={{ transitionDelay: mounted ? `${100 + i * 60}ms` : "0ms" }}
          >
            <StatCard {...card} />
          </div>
        ))}
      </div>

      {/* Chart + Severity */}
      <div className={cn(
        "grid gap-4 lg:grid-cols-5 transition-all duration-500 ease-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )} style={{ transitionDelay: mounted ? "350ms" : "0ms" }}>
        <Card className="lg:col-span-3 border-border shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <CardTitle className="text-sm font-medium">Alert Activity</CardTitle>
              </div>
              <span className="text-xs text-muted-foreground">7 days</span>
            </div>
          </CardHeader>
          <CardContent>
            <AlertsChart data={data?.alertsPerDay} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">By Severity</CardTitle>
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
        <Card className="lg:col-span-2 border-border shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Package Health</CardTitle>
              <Link href="/dashboard/packages" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PackageHealth />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
              <Link href="/dashboard/alerts" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="divide-y divide-border">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="group flex items-center gap-3 px-6 py-3 transition-colors hover:bg-muted/30 cursor-default"
                >
                  <ShieldAlert className={cn(
                    "h-4 w-4 shrink-0",
                    alert.severity === "critical" ? "text-[var(--severity-critical)]" :
                    alert.severity === "high" ? "text-[var(--severity-high)]" :
                    "text-muted-foreground"
                  )} strokeWidth={1.7} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-medium">
                        {alert.packageName}
                      </code>
                      <SeverityBadge severity={alert.severity as Severity} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {alert.title}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={alert.status as "new" | "acknowledged" | "resolved" | "ignored"} />
                    <p className="mt-1 text-[10px] text-muted-foreground tabular-nums font-mono">
                      <TimeAgo date={new Date(alert.detectedAt)} />
                    </p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                  No alerts yet. Add packages to start monitoring.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* Security Posture */
function SecurityPosture({ stats }: { stats: { totalPackages: number; activeAlerts: number; criticalIssues: number } }) {
  const score = Math.max(0, Math.min(100, 100 - stats.criticalIssues * 10 - stats.activeAlerts * 2));
  const isGood = score >= 70;
  const isOkay = score >= 40;

  return (
    <div className="rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {isGood ? (
            <ShieldCheck className="h-5 w-5 text-emerald-500" strokeWidth={1.6} />
          ) : (
            <ShieldAlert className="h-5 w-5 text-[var(--severity-critical)]" strokeWidth={1.6} />
          )}
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-medium">
                {isGood ? "Looking good" : isOkay ? "Needs attention" : "Action required"}
              </h3>
              <span className={cn(
                "text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded",
                isGood ? "bg-emerald-500/10 text-emerald-500"
                  : isOkay ? "bg-[var(--severity-medium-bg)] text-[var(--severity-medium)]"
                  : "bg-[var(--severity-critical-bg)] text-[var(--severity-critical)]"
              )}>
                {score}/100
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {stats.criticalIssues > 0
                ? `${stats.criticalIssues} critical issue${stats.criticalIssues > 1 ? "s" : ""} require immediate attention`
                : `Monitoring ${stats.totalPackages} packages with ${stats.activeAlerts} active alert${stats.activeAlerts !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        {stats.criticalIssues > 0 && (
          <Link href="/dashboard/alerts">
            <Button size="sm" variant="outline" className="h-8 text-xs text-red-500 border-red-500/20 hover:bg-red-500/5">
              Review
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        )}
      </div>
      <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            isGood ? "bg-emerald-500" : isOkay ? "bg-[var(--severity-medium)]" : "bg-[var(--severity-critical)]"
          )}
          style={{ width: `${score}%`, opacity: 0.7 }}
        />
      </div>
    </div>
  );
}

/* Severity Breakdown */
function SeverityBreakdown({ counts }: { counts: { critical: number; high: number; medium: number; low: number } }) {
  const [hoveredSev, setHoveredSev] = useState<string | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const sevs = [
    { key: "critical", label: "Critical", count: counts.critical, cssVar: "--severity-critical" },
    { key: "high", label: "High", count: counts.high, cssVar: "--severity-high" },
    { key: "medium", label: "Medium", count: counts.medium, cssVar: "--severity-medium" },
    { key: "low", label: "Low", count: counts.low, cssVar: "--severity-low" },
  ];

  return (
    <div className="space-y-5" onMouseLeave={() => setHoveredSev(null)}>
      <div className="h-1 rounded-full bg-muted overflow-hidden flex gap-px">
        {sevs.map((sev, i) => {
          const pct = (sev.count / total) * 100;
          if (pct === 0) return null;
          const isHovered = hoveredSev === sev.key;
          return (
            <div
              key={sev.key}
              className={cn(
                "h-full rounded-full transition-all duration-300 ease-out cursor-default",
                isHovered ? "opacity-100" : hoveredSev ? "opacity-30" : "opacity-70"
              )}
              style={{
                width: animated ? `${pct}%` : "0%",
                transitionDelay: animated ? "0ms" : `${i * 80}ms`,
                backgroundColor: `var(${sev.cssVar})`,
              }}
              onMouseEnter={() => setHoveredSev(sev.key)}
            />
          );
        })}
      </div>

      <div className="space-y-0">
        {sevs.map((sev) => {
          const pct = Math.round((sev.count / total) * 100);
          const isHovered = hoveredSev === sev.key;
          return (
            <div
              key={sev.key}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 -mx-3 transition-colors cursor-default",
                isHovered && "bg-muted/50"
              )}
              onMouseEnter={() => setHoveredSev(sev.key)}
            >
              <div
                className={cn("h-2 w-2 rounded-full transition-transform", isHovered && "scale-125")}
                style={{ backgroundColor: `var(${sev.cssVar})`, opacity: isHovered ? 1 : 0.7 }}
              />
              <span className={cn("text-sm flex-1 transition-colors", isHovered ? "text-foreground" : "text-muted-foreground")}>
                {sev.label}
              </span>
              <span className="text-xs font-mono tabular-nums text-muted-foreground w-7 text-right">
                {pct}%
              </span>
              <span className={cn(
                "text-sm font-semibold tabular-nums w-5 text-right transition-colors",
                isHovered ? "text-foreground" : "text-muted-foreground"
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

/* Empty State */
function EmptyState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your security posture at a glance.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-border py-16 text-center">
        <GitBranch className="h-8 w-8 text-muted-foreground mb-4" strokeWidth={1.5} />
        <p className="text-base font-semibold">No projects connected</p>
        <p className="mt-1.5 max-w-[320px] text-sm text-muted-foreground">
          Import your GitHub repositories to start scanning for vulnerabilities.
        </p>
        <Link href="/dashboard/repositories" className="mt-6">
          <Button size="sm" className="text-sm h-9 px-5">
            <GitBranch className="mr-1.5 h-4 w-4" />
            Import from GitHub
            <ArrowRight className="ml-1.5 h-4 w-4 opacity-60" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
