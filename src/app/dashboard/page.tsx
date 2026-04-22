"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_STATS, MOCK_ALERTS, MOCK_FEED } from "@/lib/constants";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { TimeAgo } from "@/components/shared/time-ago";
import { AlertsChart } from "@/components/dashboard/alerts-chart";
import { PackageHealth } from "@/components/dashboard/package-health";
import {
  Package, AlertTriangle, ShieldAlert, Shield, ArrowRight, Activity, Plus, Upload,
  ShieldCheck, Radio,
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
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Overview</h1>
          <p className="mt-1 text-[14px] text-muted-foreground/45">Your security posture at a glance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/feed">
            <Button variant="outline" size="sm" className="h-8 rounded-lg px-3 text-[12px] border-border/50">
              <Radio className="mr-1.5 h-3 w-3" />
              Live Feed
            </Button>
          </Link>
          <Link href="/dashboard/packages">
            <Button size="sm" className="h-8 rounded-lg px-3 text-[12px]">
              <Plus className="mr-1.5 h-3 w-3" />
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
        <Card className="lg:col-span-3 border-border/50 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-muted-foreground/30" strokeWidth={1.5} />
                <CardTitle className="text-[13px] font-medium">Alert Activity</CardTitle>
              </div>
              <span className="text-[10px] text-muted-foreground/30 uppercase tracking-wider">7 days</span>
            </div>
          </CardHeader>
          <CardContent>
            <AlertsChart data={data?.alertsPerDay} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-[13px] font-medium">By Severity</CardTitle>
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
        <Card className="lg:col-span-2 border-border/50 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[13px] font-medium">Package Health</CardTitle>
              <Link href="/dashboard/packages" className="text-[11px] text-muted-foreground/35 hover:text-foreground transition-colors flex items-center gap-1 group">
                All <ArrowRight className="h-2.5 w-2.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PackageHealth />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[13px] font-medium">Recent Alerts</CardTitle>
              <Link href="/dashboard/alerts" className="text-[11px] text-muted-foreground/35 hover:text-foreground transition-colors flex items-center gap-1 group">
                All <ArrowRight className="h-2.5 w-2.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="divide-y divide-border/30">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="group flex items-center gap-3 px-6 py-3 transition-colors duration-100 hover:bg-foreground/[0.02] cursor-default"
                >
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    alert.severity === "critical" ? "bg-[var(--severity-critical-bg)]" :
                    alert.severity === "high" ? "bg-[var(--severity-high-bg)]" :
                    "bg-[var(--severity-medium-bg)]"
                  )}>
                    <ShieldAlert className={cn(
                      "h-3 w-3",
                      alert.severity === "critical" ? "text-[var(--severity-critical)]" :
                      alert.severity === "high" ? "text-[var(--severity-high)]" :
                      "text-[var(--severity-medium)]"
                    )} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] font-mono font-medium text-foreground/70">
                        {alert.packageName}
                      </code>
                      <SeverityBadge severity={alert.severity as Severity} />
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/40 truncate group-hover:text-muted-foreground/60 transition-colors">
                      {alert.title}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={alert.status as "new" | "acknowledged" | "resolved" | "ignored"} />
                    <p className="mt-1 text-[9px] text-muted-foreground/25 tabular-nums font-mono">
                      <TimeAgo date={new Date(alert.detectedAt)} />
                    </p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="px-6 py-10 text-center text-[12px] text-muted-foreground/35">
                  No alerts yet. Add packages to start monitoring.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Feed */}
      <div className={cn(
        "transition-all duration-500 ease-out",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )} style={{ transitionDelay: mounted ? "550ms" : "0ms" }}>
        <Card className="border-border/50 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-[5px] w-[5px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--severity-critical)]/40 duration-[2500ms]" />
                  <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[var(--severity-critical)]" />
                </span>
                <CardTitle className="text-[13px] font-medium">Live Feed</CardTitle>
              </div>
              <Link href="/dashboard/feed" className="text-[11px] text-muted-foreground/35 hover:text-foreground transition-colors flex items-center gap-1 group">
                Open feed <ArrowRight className="h-2.5 w-2.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="divide-y divide-border/25">
              {MOCK_FEED.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-3 px-6 py-2.5 hover:bg-foreground/[0.015] transition-colors cursor-default">
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    event.severity === "critical" ? "bg-[var(--severity-critical)]" :
                    event.severity === "high" ? "bg-[var(--severity-high)]" :
                    event.severity === "medium" ? "bg-[var(--severity-medium)]" :
                    "bg-[var(--severity-low)]"
                  )} />
                  <code className="text-[11px] font-mono text-foreground/50 w-[100px] truncate shrink-0">
                    {event.packageName}
                  </code>
                  <span className="text-[12px] text-muted-foreground/40 truncate flex-1">{event.title}</span>
                  <span className="text-[10px] text-muted-foreground/25 shrink-0">{event.ecosystem}</span>
                  <span className="text-[10px] text-muted-foreground/20 font-mono tabular-nums shrink-0">
                    {Math.round((Date.now() - event.timestamp.getTime()) / 60000)}m
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ─── Security Posture ─── */
function SecurityPosture({ stats }: { stats: { totalPackages: number; activeAlerts: number; criticalIssues: number } }) {
  const score = Math.max(0, Math.min(100, 100 - stats.criticalIssues * 10 - stats.activeAlerts * 2));
  const isGood = score >= 70;
  const isOkay = score >= 40;

  return (
    <div className={cn(
      "rounded-xl border p-5",
      isGood ? "border-[var(--success)]/12 bg-[var(--success)]/[0.02]"
        : isOkay ? "border-[var(--severity-medium-ring)]/60 bg-[var(--severity-medium-bg)]/20"
        : "border-[var(--severity-critical-ring)]/60 bg-[var(--severity-critical-bg)]/20"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            isGood ? "bg-[var(--success)]/8" : isOkay ? "bg-[var(--severity-medium-bg)]" : "bg-[var(--severity-critical-bg)]"
          )}>
            {isGood ? (
              <ShieldCheck className="h-4 w-4 text-[var(--success)]" strokeWidth={1.6} />
            ) : (
              <ShieldAlert className="h-4 w-4 text-[var(--severity-critical)]" strokeWidth={1.6} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-[14px] font-medium">
                {isGood ? "Looking good" : isOkay ? "Needs attention" : "Action required"}
              </h3>
              <span className={cn(
                "text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md",
                isGood ? "bg-[var(--success)]/6 text-[var(--success)]"
                  : isOkay ? "bg-[var(--severity-medium-bg)] text-[var(--severity-medium)]"
                  : "bg-[var(--severity-critical-bg)] text-[var(--severity-critical)]"
              )}>
                {score}/100
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground/40 mt-0.5">
              {stats.criticalIssues > 0
                ? `${stats.criticalIssues} critical issue${stats.criticalIssues > 1 ? "s" : ""} require immediate attention`
                : `Monitoring ${stats.totalPackages} packages with ${stats.activeAlerts} active alert${stats.activeAlerts !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        {stats.criticalIssues > 0 && (
          <Link href="/dashboard/alerts">
            <Button size="sm" variant="outline" className="h-8 rounded-lg px-3.5 text-[11px] font-medium border-[var(--severity-critical)]/20 text-[var(--severity-critical)] hover:bg-[var(--severity-critical-bg)]">
              Review
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        )}
      </div>
      <div className="mt-4 h-[2px] rounded-full bg-foreground/[0.03] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            isGood ? "bg-[var(--success)]" : isOkay ? "bg-[var(--severity-medium)]" : "bg-[var(--severity-critical)]"
          )}
          style={{ width: `${score}%`, opacity: 0.6 }}
        />
      </div>
    </div>
  );
}

/* ─── Severity Breakdown ─── */
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
      {/* Stacked bar */}
      <div className="h-[4px] rounded-full bg-foreground/[0.03] overflow-hidden flex gap-px">
        {sevs.map((sev, i) => {
          const pct = (sev.count / total) * 100;
          if (pct === 0) return null;
          const isHovered = hoveredSev === sev.key;
          return (
            <div
              key={sev.key}
              className={cn(
                "h-full rounded-full transition-all duration-300 ease-out cursor-default",
                isHovered ? "opacity-90" : hoveredSev ? "opacity-20" : "opacity-50"
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

      {/* Legend */}
      <div className="space-y-0">
        {sevs.map((sev) => {
          const pct = Math.round((sev.count / total) * 100);
          const isHovered = hoveredSev === sev.key;
          return (
            <div
              key={sev.key}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 -mx-3 transition-colors duration-100 cursor-default",
                isHovered && "bg-foreground/[0.03]"
              )}
              onMouseEnter={() => setHoveredSev(sev.key)}
            >
              <div
                className={cn("h-2 w-2 rounded-full transition-transform duration-100", isHovered && "scale-125")}
                style={{ backgroundColor: `var(${sev.cssVar})`, opacity: isHovered ? 0.9 : 0.5 }}
              />
              <span className={cn(
                "text-[12px] flex-1 transition-colors",
                isHovered ? "text-foreground" : "text-foreground/45"
              )}>
                {sev.label}
              </span>
              <span className="text-[11px] font-mono tabular-nums text-muted-foreground/25 w-[28px] text-right">
                {pct}%
              </span>
              <span className={cn(
                "text-[13px] font-semibold tabular-nums w-[20px] text-right transition-colors",
                isHovered ? "text-foreground" : "text-foreground/50"
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

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Overview</h1>
        <p className="mt-1 text-[14px] text-muted-foreground/45">Your security posture at a glance.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 py-24 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.04] mb-5">
          <Package className="h-6 w-6 text-muted-foreground/30" strokeWidth={1.4} />
        </div>
        <h2 className="text-[16px] font-medium">Start monitoring your packages</h2>
        <p className="mt-2 max-w-sm text-[13px] text-muted-foreground/40 leading-relaxed">
          Add packages you depend on and we&apos;ll alert you when vulnerabilities are disclosed.
        </p>
        <div className="mt-8 flex items-center gap-2.5">
          <Link href="/dashboard/packages">
            <Button size="sm" className="h-9 px-4 text-[12px] rounded-lg">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Package
            </Button>
          </Link>
          <Link href="/dashboard/packages">
            <Button variant="outline" size="sm" className="h-9 px-4 text-[12px] rounded-lg border-border/50">
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Upload package.json
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
