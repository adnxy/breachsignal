"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_FEED, SEVERITY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Severity, SignalType, FeedEvent } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Pause, Play, ShieldAlert, AlertTriangle, Bug, Trash2,
  FileText, UserX, Lock, Radio, RefreshCw, Zap, Globe,
  TrendingUp, Clock, ArrowUpRight,
} from "lucide-react";

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

const severities: Severity[] = ["critical", "high", "medium", "low"];

interface FeedItemResponse {
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
}

type MappedEvent = {
  id: string;
  _uid: string;
  type: SignalType;
  title: string;
  severity: Severity;
  packageName: string;
  ecosystem: string;
  timestamp: Date;
  description: string;
  sourceUrl?: string;
  sourceName?: string;
};

function formatTimeAgo(date: Date): string {
  const secs = Math.round((Date.now() - date.getTime()) / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

let mockIndex = 0;
function createMockEvent(): MappedEvent {
  const source = MOCK_FEED[mockIndex % MOCK_FEED.length];
  mockIndex++;
  return {
    ...source,
    id: source.id,
    _uid: `${source.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date(Date.now() - Math.random() * 10000),
    sourceUrl: undefined,
    sourceName: undefined,
  };
}

export default function LiveFeedPage() {
  const [events, setEvents] = useState<MappedEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | null>(null);
  const [newestUid, setNewestUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [totalCount, setTotalCount] = useState(2431);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFetchRef = useRef<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeed = useCallback(
    async (isPolling = false) => {
      try {
        const params = new URLSearchParams({ limit: "50" });
        if (severityFilter) params.set("severity", severityFilter);
        if (search) params.set("search", search);

        const res = await fetch(`/api/feed?${params}`);
        if (!res.ok) throw new Error("Feed fetch failed");

        const data = await res.json();
        const items: FeedItemResponse[] = data.items;

        if (items.length === 0 && !isPolling) {
          setUseMock(true);
          setEvents(
            MOCK_FEED.map((e) => ({
              ...e,
              _uid: `${e.id}-init`,
              sourceUrl: undefined,
              sourceName: undefined,
            }))
          );
          setLoading(false);
          return;
        }

        setUseMock(false);
        const mapped: MappedEvent[] = items.map((item) => ({
          id: item.id,
          _uid: `api-${item.id}`,
          type: (item.type || "VULNERABILITY") as SignalType,
          title: item.title,
          severity: item.severity.toLowerCase() as Severity,
          packageName: item.packageName || "unknown",
          ecosystem: item.ecosystem || "npm",
          timestamp: new Date(item.publishedAt),
          description: item.description,
          sourceUrl: item.sourceUrl || undefined,
          sourceName: item.source?.name,
        }));

        if (isPolling && lastFetchRef.current) {
          const newItems = mapped.filter((m) => m.id > lastFetchRef.current!);
          if (newItems.length > 0) {
            setNewestUid(newItems[0]._uid);
            setTotalCount((c) => c + newItems.length);
            setTimeout(() => setNewestUid(null), 3500);
          }
        }

        if (mapped.length > 0) lastFetchRef.current = mapped[0].id;
        setEvents(mapped);
      } catch {
        if (!events.length) {
          setUseMock(true);
          setEvents(
            MOCK_FEED.map((e) => ({
              ...e,
              _uid: `${e.id}-init`,
              sourceUrl: undefined,
              sourceName: undefined,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [severityFilter, search]
  );

  const refreshFeed = useCallback(async () => {
    setLoading(true);
    await fetchFeed(false);
  }, [fetchFeed]);

  useEffect(() => { fetchFeed(false); }, [fetchFeed]);

  useEffect(() => {
    if (paused || useMock) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(() => fetchFeed(true), 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [paused, fetchFeed, useMock]);

  useEffect(() => {
    if (!useMock || paused) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 7000 + Math.random() * 5000;
      timeout = setTimeout(() => {
        const newEvent = createMockEvent();
        setNewestUid(newEvent._uid);
        setEvents((prev) => [newEvent, ...prev.slice(0, 29)]);
        setTotalCount((c) => c + 1);
        setTimeout(() => setNewestUid(null), 3500);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [useMock, paused]);

  useEffect(() => {
    if (paused) return;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const delay = 4000 + Math.random() * 4000;
      timeout = setTimeout(() => { setTotalCount((c) => c + 1); tick(); }, delay);
    };
    tick();
    return () => clearTimeout(timeout);
  }, [paused]);

  const filtered = events.filter((e) => {
    if (severityFilter && e.severity !== severityFilter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.packageName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: events.length,
    critical: events.filter((e) => e.severity === "critical").length,
    high: events.filter((e) => e.severity === "high").length,
    medium: events.filter((e) => e.severity === "medium").length,
    low: events.filter((e) => e.severity === "low").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">Live Feed</h1>
            <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                {!paused && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/40 duration-[2000ms]" />
                )}
                <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", paused ? "bg-muted-foreground" : "bg-red-500")} />
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {paused ? "Paused" : "Live"}
              </span>
            </div>
            {useMock && (
              <span className="text-[10px] font-medium text-[var(--severity-medium)] bg-[var(--severity-medium-bg)] px-2 py-0.5 rounded">
                Demo
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time security intelligence across all monitored ecosystems.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-sm h-8" onClick={refreshFeed} disabled={loading}>
            <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="text-sm h-8" onClick={() => setPaused(!paused)}>
            {paused ? <Play className="mr-1.5 h-3.5 w-3.5" /> : <Pause className="mr-1.5 h-3.5 w-3.5" />}
            {paused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
              Signals Today
            </div>
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-red-500 uppercase tracking-wider">
              <TrendingUp className="h-3 w-3" />
              live
            </span>
          </div>
          <motion.span
            key={totalCount}
            initial={{ opacity: 0.4, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-2xl font-semibold tabular-nums tracking-tight leading-none"
          >
            {totalCount.toLocaleString()}
          </motion.span>
        </div>
        {(["critical", "high", "medium"] as Severity[]).map((s) => (
          <div
            key={s}
            className={cn(
              "rounded-xl border p-4 transition-all cursor-pointer",
              severityFilter === s
                ? `${SEVERITY_CONFIG[s].border} ${SEVERITY_CONFIG[s].bg}`
                : "border-border hover:bg-muted/30"
            )}
            onClick={() => setSeverityFilter(severityFilter === s ? null : s)}
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <span className={cn("h-1.5 w-1.5 rounded-full", SEVERITY_CONFIG[s].dot)} />
              <span className="capitalize">{s}</span>
            </div>
            <span className={cn("text-2xl font-semibold tabular-nums tracking-tight leading-none", SEVERITY_CONFIG[s].color)}>
              {counts[s as keyof typeof counts]}
            </span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.8} />
          <Input
            placeholder="Search signals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex gap-0.5 rounded-lg border border-border p-1">
          {[null, ...severities].map((s) => (
            <button
              key={s ?? "all"}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all capitalize",
                severityFilter === s
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setSeverityFilter(s)}
            >
              {s && <span className={cn("h-1.5 w-1.5 rounded-full", severityFilter === s ? "bg-background/60" : SEVERITY_CONFIG[s].dot)} />}
              {s ?? "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Feed table */}
      {loading ? (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-7 w-7 rounded-lg bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-3/4 rounded bg-muted" />
                  <div className="h-2.5 w-1/2 rounded bg-muted" />
                </div>
                <div className="h-5 w-14 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-2.5 border-b border-border text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <span className="w-[60px]">Time</span>
            <span className="w-7" />
            <span className="flex-1">Signal</span>
            <span className="w-[72px] text-center">Severity</span>
            <span className="hidden sm:block w-[64px]">Source</span>
            <span className="w-5" />
          </div>

          {!paused && (
            <div className="relative h-px overflow-hidden">
              <div className="feed-scan-line absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
            </div>
          )}

          <div className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {filtered.map((event) => {
                const Icon = iconMap[event.type] || ShieldAlert;
                const isNew = event._uid === newestUid;
                const severity = event.severity;

                return (
                  <motion.div
                    key={event._uid}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className={cn(
                      "group flex items-center gap-4 px-5 py-3 cursor-default transition-colors",
                      isNew ? "feed-item-flash" : "hover:bg-muted/30"
                    )}
                    style={isNew ? { "--feed-flash-color": `var(--severity-${severity}-bg)` } as React.CSSProperties : undefined}
                  >
                    <span className="w-[60px] shrink-0 text-xs font-mono tabular-nums text-muted-foreground">
                      {formatTime(event.timestamp)}
                    </span>

                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                      isNew ? `${SEVERITY_CONFIG[severity].bg} ring-1 ${SEVERITY_CONFIG[severity].border}` : "bg-muted"
                    )}>
                      <Icon className={cn("h-3.5 w-3.5", isNew ? SEVERITY_CONFIG[severity].color : "text-muted-foreground")} strokeWidth={1.6} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{event.title}</span>
                        {isNew && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="shrink-0 flex items-center gap-0.5 rounded bg-red-500 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-white"
                          >
                            <Zap className="h-2 w-2" />
                            New
                          </motion.span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <code className="text-xs font-mono text-muted-foreground">{event.packageName}</code>
                        <span className="text-muted-foreground/40">/</span>
                        <span className="text-[10px] text-muted-foreground">{event.ecosystem}</span>
                      </div>
                    </div>

                    <div className="w-[72px] flex justify-center shrink-0">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        SEVERITY_CONFIG[severity].badge
                      )}>
                        {SEVERITY_CONFIG[severity].label}
                      </span>
                    </div>

                    <span className="hidden sm:block w-[64px] text-[10px] text-muted-foreground truncate">
                      {event.sourceName || event.ecosystem}
                    </span>

                    <div className="w-5 shrink-0">
                      {event.sourceUrl ? (
                        <a
                          href={event.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      ) : (
                        <div className="h-5 w-5" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Radio className="h-5 w-5 text-muted-foreground mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium">No signals found</p>
              <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters.</p>
            </div>
          )}

          <div className="flex items-center justify-between px-5 py-2.5 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                {filtered.length} signal{filtered.length !== 1 ? "s" : ""}
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                {!paused && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40 duration-[3000ms]" />}
                <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", paused ? "bg-muted-foreground" : "bg-emerald-500")} />
              </span>
              <span className="text-[10px] text-muted-foreground">
                {paused ? "Feed paused" : "Monitoring active"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
