"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MOCK_FEED, SEVERITY_CONFIG, SIGNAL_TYPE_CONFIG } from "@/lib/constants";
import {
  ShieldAlert,
  AlertTriangle,
  Bug,
  Trash2,
  FileText,
  UserX,
  Lock,
  ArrowRight,
  Globe,
  Activity,
  Shield,
  Eye,
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
    setTimeout(() => setNewestId(null), 2800);
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
      <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-border/60 bg-card premium-shadow-lg">

        {/* ─── Header ─── */}
        <div className="relative border-b border-border/50">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--severity-critical)]/25 to-transparent" />

          <div className="flex items-center justify-between px-4 py-3 sm:px-7 sm:py-3.5">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/[0.04] ring-1 ring-border/50">
                <Shield className="h-4 w-4 text-foreground/50" strokeWidth={1.8} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] sm:text-[14px] font-semibold tracking-[-0.02em]">
                    Breach Feed
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-[6px] w-[6px] sm:h-[7px] sm:w-[7px]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/50 duration-[2000ms]" />
                      <span className="relative inline-flex h-full w-full rounded-full bg-[var(--success)]" />
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--success)]">
                      Live
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground/50 hidden sm:block">
                  Real-time security intelligence across {ecosystems.length} ecosystems
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
              <Globe className="h-3 w-3 text-muted-foreground/40 hidden sm:block" />
              <span className="font-mono tabular-nums text-muted-foreground/60">
                <motion.span
                  key={totalCount}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-block text-foreground font-semibold"
                >
                  {totalCount.toLocaleString()}
                </motion.span>{" "}
                <span className="hidden sm:inline">today</span>
              </span>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex items-center border-t border-border/30 bg-muted/[0.06]">
            <div className="flex flex-1 items-center divide-x divide-border/30">
              {(["critical", "high", "medium", "low"] as const).map((sev) => (
                <div key={sev} className="flex flex-1 items-center justify-center gap-1.5 py-2 px-1.5 sm:gap-2 sm:py-2.5 sm:px-3">
                  <span className={cn("h-[5px] w-[5px] sm:h-[6px] sm:w-[6px] rounded-full", SEVERITY_CONFIG[sev].dot)} />
                  <span className="text-[10px] sm:text-[11px] font-semibold tabular-nums text-foreground/70">{sevCounts[sev]}</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground/40 capitalize hidden sm:inline">{sev}</span>
                </div>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-1.5 border-l border-border/30 px-4 py-2.5">
              {ecosystems.slice(0, 5).map((eco) => (
                <span key={eco} className="rounded-full border border-border/40 bg-muted/20 px-2 py-0.5 text-[9px] font-medium text-muted-foreground/50">
                  {eco}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Column headers (hidden on small mobile) ─── */}
        <div className="hidden sm:flex items-center border-b border-border/30 bg-muted/[0.04] px-4 py-2 sm:px-7 text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/30">
          <span className="w-9 shrink-0 mr-3.5" />
          <span className="flex-1">Threat</span>
          <span className="w-[80px] text-center hidden md:block">Ecosystem</span>
          <span className="w-[72px] text-center hidden lg:block">Type</span>
          <span className="w-[48px] text-right">Time</span>
        </div>

        {/* ─── Feed rows ─── */}
        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-20 sm:h-24 bg-gradient-to-t from-card via-card/90 to-transparent" />

          <div className="max-h-[380px] sm:max-h-[520px] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.slice(0, 10).map((event) => {
                const Icon = iconMap[event.type];
                const isNew = event._uid === newestId;
                const severity = event.severity;

                return (
                  <motion.div
                    key={event._uid}
                    layout
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                      layout: { duration: 0.35 },
                    }}
                    className={cn(
                      "group relative flex items-start sm:items-center gap-2.5 sm:gap-3.5 border-b border-border/20 px-4 sm:px-7 transition-colors duration-700",
                      isNew ? "feed-item-flash py-3" : "py-2.5 sm:py-3 hover:bg-muted/[0.03]"
                    )}
                  >
                    {/* Left accent */}
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 w-[2px] transition-opacity duration-500",
                        isNew ? "opacity-100" : "opacity-0"
                      )}
                      style={{ backgroundColor: `var(--severity-${severity})` }}
                    />

                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border transition-all duration-500",
                        SEVERITY_CONFIG[severity].bg,
                        SEVERITY_CONFIG[severity].border,
                      )}
                    >
                      <Icon
                        className={cn("h-3 w-3 sm:h-4 sm:w-4", SEVERITY_CONFIG[severity].color)}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="truncate text-[12px] sm:text-[13px] font-semibold leading-tight tracking-[-0.01em]">
                          {event.title}
                        </span>
                        <span
                          className={cn(
                            "hidden sm:inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-px text-[9px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset",
                            SEVERITY_CONFIG[severity].badge
                          )}
                        >
                          <span className="h-[4px] w-[4px] rounded-full bg-current opacity-70" />
                          {SEVERITY_CONFIG[severity].label}
                        </span>
                        {isNew && (
                          <motion.span
                            className="shrink-0 rounded-full bg-[var(--severity-critical)] px-1.5 py-px text-[8px] font-bold uppercase tracking-[0.06em] text-white"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            New
                          </motion.span>
                        )}
                      </div>
                      <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                        <code className="rounded bg-muted/50 px-1 sm:px-1.5 py-px font-mono text-[9px] sm:text-[10px] font-semibold text-foreground/60">
                          {event.packageName}
                        </code>
                        {/* Show ecosystem inline on mobile instead of separate column */}
                        <span className="sm:hidden text-[9px] text-muted-foreground/30">{event.ecosystem}</span>
                        <span className="hidden sm:inline text-muted-foreground/20">/</span>
                        <span className="hidden sm:inline text-muted-foreground/40 font-medium text-[10px] truncate">{event.description.slice(0, 60)}...</span>
                      </div>
                    </div>

                    {/* Ecosystem — desktop */}
                    <span className="hidden md:flex w-[80px] justify-center">
                      <span className="rounded-full border border-border/30 bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/50">
                        {event.ecosystem}
                      </span>
                    </span>

                    {/* Type — large desktop */}
                    <span className="hidden lg:block w-[72px] text-center text-[10px] font-medium text-muted-foreground/35">
                      {SIGNAL_TYPE_CONFIG[event.type].label}
                    </span>

                    {/* Time */}
                    <span className="w-[32px] sm:w-[48px] text-right text-[9px] sm:text-[10px] font-mono tabular-nums text-muted-foreground/30 shrink-0 pt-0.5 sm:pt-0">
                      {formatTimeAgo(event.timestamp)}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="relative border-t border-border/30">
          <div className="flex items-center justify-between px-4 py-2.5 sm:px-7 sm:py-3">
            <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] text-muted-foreground/30">
              <div className="flex items-center gap-1.5">
                <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span><span className="text-foreground/50 font-semibold tabular-nums">28,345</span> packages</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Activity className="h-3 w-3" />
                <span>Updated in real-time</span>
              </div>
            </div>
            <Link
              href="/auth/signup"
              className="group flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-[12px] font-semibold text-muted-foreground/60 transition-colors duration-200 hover:text-foreground"
            >
              View full feed
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-b from-[var(--severity-critical)]/[0.02] via-foreground/[0.01] to-transparent blur-3xl" />
    </div>
  );
}
