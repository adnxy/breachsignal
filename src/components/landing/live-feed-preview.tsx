"use client";

import { useEffect, useState } from "react";
import { MOCK_FEED, SEVERITY_CONFIG } from "@/lib/constants";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { ShieldAlert, AlertTriangle, Bug, Trash2, FileText, UserX, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SignalType } from "@/types";

const iconMap: Record<SignalType, React.ElementType> = {
  VULNERABILITY: ShieldAlert, MALWARE: Bug, COMPROMISE: Lock,
  DEPRECATION: FileText, LICENSE_CHANGE: FileText, MAINTAINER_CHANGE: UserX,
  REGISTRY_REMOVAL: Trash2, SUSPICIOUS_RELEASE: AlertTriangle,
};

export function LiveFeedPreview() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [newestIndex, setNewestIndex] = useState(-1);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount((c) => {
        const next = Math.min(c + 1, MOCK_FEED.length);
        setNewestIndex(next - 1);
        setTimeout(() => setNewestIndex(-1), 1000);
        return next;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const items = MOCK_FEED.slice(0, visibleCount);

  return (
    <div className="relative mx-auto max-w-[700px]">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        {/* macOS chrome */}
        <div className="flex items-center border-b border-border bg-muted/50 px-4 py-2.5">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1">
            <Lock className="h-[10px] w-[10px] text-[var(--success)]" strokeWidth={2.5} />
            <span className="text-[11px] text-muted-foreground font-mono">breachsignal.io/feed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--severity-critical)]/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--severity-critical)]" />
            </span>
            <span className="text-[10px] font-bold text-[var(--severity-critical)] uppercase tracking-wide">Live</span>
          </div>
        </div>

        {/* Feed rows */}
        <div>
          {items.map((event, i) => {
            const Icon = iconMap[event.type];
            const isNewest = i === newestIndex;
            return (
              <div
                key={event.id}
                className={cn(
                  "flex items-start gap-3 px-5 py-3 transition-colors duration-500",
                  i < items.length - 1 && "border-b border-border/50",
                  isNewest && "bg-muted/40",
                )}
                style={{ animation: isNewest ? "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : undefined }}
              >
                <div className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
                  SEVERITY_CONFIG[event.severity].bg,
                  SEVERITY_CONFIG[event.severity].border,
                )}>
                  <Icon className={cn("h-3.5 w-3.5", SEVERITY_CONFIG[event.severity].color)} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[12px] font-semibold">{event.title}</span>
                    <SeverityBadge severity={event.severity} />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <code className="font-mono font-medium text-foreground/70">{event.packageName}</code>
                    <span>&middot;</span>
                    <span>{event.ecosystem}</span>
                  </div>
                </div>
                <span className="shrink-0 pt-0.5 text-[10px] text-muted-foreground tabular-nums font-mono">
                  {Math.round((Date.now() - event.timestamp.getTime()) / 60000)}m
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
      </div>
    </div>
  );
}
