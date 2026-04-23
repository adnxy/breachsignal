"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MOCK_FEED, SEVERITY_CONFIG, SIGNAL_TYPE_CONFIG } from "@/lib/constants";
import {
  ShieldAlert, AlertTriangle, Bug, Trash2, FileText, UserX, Lock,
  ArrowRight, Globe, Activity, Shield, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Severity, SignalType, FeedEvent } from "@/types";

const iconMap: Record<SignalType, React.ElementType> = {
  VULNERABILITY: ShieldAlert,
  MALWARE: Bug,
  COMPROMISE: Lock,
  DEPRECATION: FileText,
  LICENSE_CHANGE: FileText,
  MAINTAINER_CHANGE: UserX,
  REGISTRY_REMOVAL: Trash2,
  SUSPICIOUS_RELEASE: AlertTriangle,
};

function formatTimeAgo(date: Date): string {
  const secs = Math.round((Date.now() - date.getTime()) / 1000);
  if (secs < 10) return "now";
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  return `${hours}h`;
}

function createFeedItem(index: number): FeedEvent & { _uid: string } {
  const source = MOCK_FEED[index % MOCK_FEED.length];
  return {
    ...source,
    _uid: `${source.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date(Date.now() - Math.random() * 6000),
  };
}

export function LiveFeedPreview() {
  const [items, setItems] = useState<(FeedEvent & { _uid: string })[]>(() =>
    Array.from({ length: 8 }, (_, i) => createFeedItem(i))
  );
  const [totalCount, setTotalCount] = useState(1847);
  const [newestId, setNewestId] = useState<string | null>(null);
  const indexRef = useRef(8);

  const addItem = useCallback(() => {
    const newItem = createFeedItem(indexRef.current++);
    setNewestId(newItem._uid);
    setItems((prev) => [newItem, ...prev.slice(0, 9)]);
    setTotalCount((c) => c + 1);
    setTimeout(() => setNewestId(null), 3200);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 4500 + Math.random() * 3000;
      timeout = setTimeout(() => { addItem(); schedule(); }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [addItem]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const delay = 3000 + Math.random() * 4000;
      timeout = setTimeout(() => { setTotalCount((c) => c + 1); tick(); }, delay);
    };
    tick();
    return () => clearTimeout(timeout);
  }, []);

  const sevCounts = items.reduce(
    (acc, item) => {
      if (item.severity in acc) acc[item.severity as keyof typeof acc]++;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );

  const ecosystems = [...new Set(items.map((i) => i.ecosystem))];

  return (
    <div className="relative mx-auto max-w-[960px]">
      <div className="overflow-hidden rounded-xl border border-border bg-card">

        {/* Header */}
        <div className="border-b border-border">
          <div className="flex items-center justify-between px-5 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold">Breach Feed</h3>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50 duration-[2500ms]" />
                  <span className="relative inline-flex h-full w-full rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">
                  Live
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-mono tabular-nums">
                <motion.span
                  key={totalCount}
                  initial={{ opacity: 0.4, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="inline-block text-foreground font-semibold"
                >
                  {totalCount.toLocaleString()}
                </motion.span>{" "}
                <span className="hidden sm:inline">today</span>
              </span>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex items-center border-t border-border">
            <div className="flex flex-1 items-center divide-x divide-border">
              {(["critical", "high", "medium", "low"] as const).map((sev) => (
                <div key={sev} className="flex flex-1 items-center justify-center gap-1.5 py-2 px-2 sm:gap-2 sm:py-2.5 sm:px-3">
                  <span className={cn("h-1.5 w-1.5 rounded-full", SEVERITY_CONFIG[sev].dot)} />
                  <span className="text-xs font-semibold tabular-nums">{sevCounts[sev]}</span>
                  <span className="text-[10px] text-muted-foreground capitalize hidden sm:inline">{sev}</span>
                </div>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-1.5 border-l border-border px-4 py-2.5">
              {ecosystems.slice(0, 5).map((eco) => (
                <span key={eco} className="rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {eco}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div className="hidden sm:flex items-center border-b border-border px-5 py-2 sm:px-6 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span className="w-9 shrink-0 mr-3.5" />
          <span className="flex-1">Threat</span>
          <span className="w-[80px] text-center hidden md:block">Ecosystem</span>
          <span className="w-[72px] text-center hidden lg:block">Type</span>
          <span className="w-[48px] text-right">Time</span>
        </div>

        {/* Feed rows */}
        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-card to-transparent" />

          <div className="max-h-[520px] overflow-hidden">
            <AnimatePresence initial={false}>
              {items.slice(0, 10).map((event) => {
                const Icon = iconMap[event.type];
                const isNew = event._uid === newestId;
                const severity = event.severity;

                return (
                  <motion.div
                    key={event._uid}
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                      height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                      y: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="feed-row overflow-hidden"
                  >
                    <div
                      className={cn(
                        "group relative flex items-start sm:items-center gap-3 sm:gap-3.5 border-b border-border px-5 sm:px-6 transition-colors",
                        isNew ? "feed-item-flash py-3" : "py-2.5 sm:py-3 hover:bg-muted/30"
                      )}
                      style={isNew ? { "--feed-flash-color": `var(--severity-${severity}-bg)` } as React.CSSProperties : undefined}
                    >
                      {isNew && (
                        <div
                          className="absolute inset-y-0 left-0 w-[2px]"
                          style={{ backgroundColor: `var(--severity-${severity})` }}
                        />
                      )}

                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                          SEVERITY_CONFIG[severity].bg,
                          SEVERITY_CONFIG[severity].border,
                        )}
                      >
                        <Icon
                          className={cn("h-3.5 w-3.5", SEVERITY_CONFIG[severity].color)}
                          strokeWidth={1.7}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium leading-tight">
                            {event.title}
                          </span>
                          <span
                            className={cn(
                              "hidden sm:inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ring-inset",
                              SEVERITY_CONFIG[severity].badge
                            )}
                          >
                            <span className="h-1 w-1 rounded-full bg-current opacity-70" />
                            {SEVERITY_CONFIG[severity].label}
                          </span>
                          {isNew && (
                            <motion.span
                              className="shrink-0 rounded bg-[var(--severity-critical)] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              New
                            </motion.span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs">
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium">
                            {event.packageName}
                          </code>
                          <span className="sm:hidden text-[10px] text-muted-foreground">{event.ecosystem}</span>
                          <span className="hidden sm:inline text-muted-foreground">/</span>
                          <span className="hidden sm:inline text-muted-foreground text-[10px] truncate">{event.description.slice(0, 60)}...</span>
                        </div>
                      </div>

                      <span className="hidden md:flex w-[80px] justify-center">
                        <span className="rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {event.ecosystem}
                        </span>
                      </span>

                      <span className="hidden lg:block w-[72px] text-center text-[10px] text-muted-foreground">
                        {SIGNAL_TYPE_CONFIG[event.type].label}
                      </span>

                      <span className="w-8 sm:w-[48px] text-right text-[10px] font-mono tabular-nums text-muted-foreground shrink-0">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border">
          <div className="flex items-center justify-between px-5 py-2.5 sm:px-6 sm:py-3">
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Eye className="h-3 w-3" />
                <span><span className="text-foreground font-medium tabular-nums">28,345</span> packages</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Activity className="h-3 w-3" />
                <span>Updated in real-time</span>
              </div>
            </div>
            <Link
              href="/auth/signup"
              className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View full feed
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
