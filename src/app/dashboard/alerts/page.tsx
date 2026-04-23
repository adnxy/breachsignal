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
          <Button variant="outline" size="sm" className="text-sm h-8">
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
            Mark All Read
          </Button>
        }
      />

      {/* Segmented filter */}
      <div className="flex gap-0.5 rounded-lg border border-border p-1 w-fit">
        {severities.map((s) => (
          <button
            key={s}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
              severityFilter === s
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setSeverityFilter(s)}
          >
            {s}
            <span className={cn(
              "rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
              severityFilter === s ? "bg-background/20 text-background" : "text-muted-foreground"
            )}>
              {counts[s as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts table */}
      <Card className="border-border shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Package</th>
                  <th className="px-3 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="px-3 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Level</th>
                  <th className="px-3 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Detected</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((alert, i) => (
                  <tr
                    key={alert.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/30",
                      i < filtered.length - 1 && "border-b border-border"
                    )}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          alert.severity === "critical" ? "text-[var(--severity-critical)]" :
                          alert.severity === "high" ? "text-[var(--severity-high)]" :
                          "text-muted-foreground"
                        )} strokeWidth={1.7} />
                        <code className="text-xs font-mono font-medium">{alert.packageName}</code>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-muted-foreground">{alert.title}</span>
                    </td>
                    <td className="px-3 py-3">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="px-5 py-3 text-right text-[10px] text-muted-foreground">
                      <TimeAgo date={alert.detectedAt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bell className="mb-3 h-8 w-8 text-muted-foreground" strokeWidth={1.2} />
              <p className="text-sm font-medium">No alerts</p>
              <p className="mt-0.5 text-xs text-muted-foreground">No alerts match this filter.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert detail modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        {selectedAlert && (
          <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={selectedAlert.severity} />
                  <StatusBadge status={selectedAlert.status} />
                </div>
                <DialogTitle className="mt-2.5 text-base font-semibold tracking-tight leading-snug">{selectedAlert.title}</DialogTitle>
              </DialogHeader>
            </div>

            <div className="space-y-4 px-6 pb-6 pt-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Summary</p>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{selectedAlert.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-red-500/60">Affected</p>
                  <code className="mt-1.5 block text-xs font-mono font-medium text-red-500">
                    {selectedAlert.affectedVersions}
                  </code>
                </div>
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3.5">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500/60">Patched</p>
                  <code className="mt-1.5 block text-xs font-mono font-medium text-emerald-500">
                    {selectedAlert.patchedVersions || "No patch"}
                  </code>
                </div>
              </div>

              {selectedAlert.patchedVersions && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Upgrade Command</p>
                  <div className="flex items-center gap-2 rounded-lg bg-muted border border-border px-3.5 py-2.5">
                    <code className="flex-1 text-xs font-mono text-foreground">
                      npm install {selectedAlert.packageName}@{selectedAlert.patchedVersions}
                    </code>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground">
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
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 text-sm h-9")}
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  View Source
                </a>
                <Button size="sm" className="flex-1 text-sm h-9">
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
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
