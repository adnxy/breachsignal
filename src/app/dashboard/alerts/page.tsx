"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { TimeAgo } from "@/components/shared/time-ago";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_ALERTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AlertItem, Severity } from "@/types";
import {
  Bell, ExternalLink, CheckCircle2, Copy, ShieldAlert,
} from "lucide-react";

const severities: (Severity | "all")[] = ["all", "critical", "high", "medium", "low"];

export default function AlertsPage() {
  const [alerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const filtered = alerts.filter(
    (a) => severityFilter === "all" || a.severity === severityFilter
  );

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        description="Security alerts for your tracked packages."
        action={
          <Button variant="outline" size="sm" className="text-[11px] h-7 font-[550]">
            <CheckCircle2 className="mr-1.5 h-3 w-3" strokeWidth={2} />
            Mark All Read
          </Button>
        }
      />

      {/* Segmented filter */}
      <div className="flex gap-px rounded-xl bg-foreground/[0.025] p-[3px] ring-1 ring-foreground/[0.03] w-fit">
        {severities.map((s) => (
          <button
            key={s}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-[5px] text-[10px] font-[600] capitalize transition-all",
              severityFilter === s
                ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/[0.06]"
                : "text-muted-foreground/35 hover:text-foreground/60"
            )}
            onClick={() => setSeverityFilter(s)}
          >
            {s}
            <span className={cn(
              "rounded-full px-[5px] py-[1px] text-[8px] font-[700] tabular-nums",
              severityFilter === s ? "bg-foreground/[0.06] text-foreground/60" : "text-muted-foreground/20"
            )}>
              {counts[s as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-foreground/[0.04]">
                  <th className="px-5 py-3 text-left text-[8px] font-[700] uppercase tracking-[0.12em] text-muted-foreground/20">Package</th>
                  <th className="px-3 py-3 text-left text-[8px] font-[700] uppercase tracking-[0.12em] text-muted-foreground/20">Title</th>
                  <th className="px-3 py-3 text-left text-[8px] font-[700] uppercase tracking-[0.12em] text-muted-foreground/20">Level</th>
                  <th className="px-3 py-3 text-left text-[8px] font-[700] uppercase tracking-[0.12em] text-muted-foreground/20">Status</th>
                  <th className="px-5 py-3 text-right text-[8px] font-[700] uppercase tracking-[0.12em] text-muted-foreground/20">Detected</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((alert, i) => (
                  <tr
                    key={alert.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-foreground/[0.012]",
                      i < filtered.length - 1 && "border-b border-foreground/[0.025]",
                      alert.status === "new" && "bg-foreground/[0.008]"
                    )}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className={cn(
                          "h-3 w-3 shrink-0",
                          alert.severity === "critical" ? "text-[var(--severity-critical)]/50" :
                          alert.severity === "high" ? "text-[var(--severity-high)]/50" :
                          "text-muted-foreground/25"
                        )} strokeWidth={2} />
                        <code className="text-[11px] font-mono font-[560]">{alert.packageName}</code>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[11px] text-foreground/60">{alert.title}</span>
                    </td>
                    <td className="px-3 py-3">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="px-5 py-3 text-right text-[9px] text-muted-foreground/20">
                      <TimeAgo date={alert.detectedAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bell className="mb-3 h-8 w-8 text-muted-foreground/10" strokeWidth={1.2} />
              <p className="text-[12px] font-[550]">No alerts</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/30">No alerts match this filter.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert detail modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        {selectedAlert && (
          <DialogContent className="max-w-md rounded-2xl border-foreground/[0.06] shadow-2xl shadow-black/10 p-0 overflow-hidden">
            {/* Colored header */}
            <div className={cn(
              "px-6 pt-6 pb-4",
              selectedAlert.severity === "critical" ? "bg-[var(--severity-critical)]/[0.03]" :
              selectedAlert.severity === "high" ? "bg-[var(--severity-high)]/[0.03]" : "bg-foreground/[0.01]"
            )}>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={selectedAlert.severity} />
                  <StatusBadge status={selectedAlert.status} />
                </div>
                <DialogTitle className="mt-2.5 text-[15px] font-[620] tracking-[-0.02em] leading-snug">{selectedAlert.title}</DialogTitle>
              </DialogHeader>
            </div>

            <div className="space-y-4 px-6 pb-6 pt-2">
              <div>
                <p className="text-[9px] font-[700] uppercase tracking-[0.12em] text-muted-foreground/25">Summary</p>
                <p className="mt-1.5 text-[12px] leading-[1.8] text-foreground/70">{selectedAlert.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-[var(--severity-critical)]/[0.04] border border-[var(--severity-critical)]/[0.08] p-3.5">
                  <p className="text-[8px] font-[700] uppercase tracking-[0.12em] text-[var(--severity-critical)]/40">Affected</p>
                  <code className="mt-1.5 block text-[12px] font-mono font-[560] text-[var(--severity-critical)]/80">
                    {selectedAlert.affectedVersions}
                  </code>
                </div>
                <div className="rounded-xl bg-[var(--success)]/[0.04] border border-[var(--success)]/[0.08] p-3.5">
                  <p className="text-[8px] font-[700] uppercase tracking-[0.12em] text-[var(--success)]/40">Patched</p>
                  <code className="mt-1.5 block text-[12px] font-mono font-[560] text-[var(--success)]/80">
                    {selectedAlert.patchedVersions || "No patch"}
                  </code>
                </div>
              </div>

              {selectedAlert.patchedVersions && (
                <div>
                  <p className="text-[9px] font-[700] uppercase tracking-[0.12em] text-muted-foreground/25 mb-2">Upgrade Command</p>
                  <div className="flex items-center gap-2 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04] px-3.5 py-2.5">
                    <code className="flex-1 text-[11px] font-mono text-foreground/60">
                      npm install {selectedAlert.packageName}@{selectedAlert.patchedVersions}
                    </code>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground/25 hover:text-foreground">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <a
                  href={selectedAlert.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 text-[11px] h-9 font-[550]")}
                >
                  <ExternalLink className="mr-1.5 h-3 w-3" />
                  View Source
                </a>
                <Button size="sm" className="flex-1 text-[11px] h-9 font-[550]">
                  <CheckCircle2 className="mr-1.5 h-3 w-3" />
                  Acknowledge
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
