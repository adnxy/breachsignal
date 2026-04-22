"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_FEED, SEVERITY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Severity, SignalType, FeedEvent } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Pause,
  Play,
  ShieldAlert,
  AlertTriangle,
  Bug,
  Trash2,
  FileText,
  UserX,
  Lock,
  Radio,
  ExternalLink,
  RefreshCw,
  Zap,
  Globe,
  TrendingUp,
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

const threatLevel: Record<Severity, { pct: number; label: string }> = {
  critical: { pct: 100, label: "Critical" },
  high: { pct: 75, label: "High" },
  medium: { pct: 45, label: "Medium" },
  low: { pct: 20, label: "Low" },
  info: { pct: 5, label: "Info" },
};

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
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFetchRef = useRef<string | null>(null);

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

  useEffect(() => {
    fetchFeed(false);
  }, [fetchFeed]);

  useEffect(() => {
    if (paused || useMock) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(() => fetchFeed(true), 30_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [paused, fetchFeed, useMock]);

  // Mock: new item every 7–12s
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

  // Gentle counter
  useEffect(() => {
    if (paused) return;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const delay = 4000 + Math.random() * 4000;
      timeout = setTimeout(() => {
        setTotalCount((c) => c + 1);
        tick();
      }, delay);
    };
    tick();
    return () => clearTimeout(timeout);
  }, [paused]);

  const filtered = events.filter((e) => {
    if (severityFilter && e.severity !== severityFilter) return false;
    if (
      search &&
      !e.title.toLowerCase().includes(search.toLowerCase()) &&
      !e.packageName.toLowerCase().includes(search.toLowerCase())
    )
      return false;
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
    <div className="space-y-5">
      <PageHeader
        title="Live Feed"
        description={`${filtered.length} security event${filtered.length !== 1 ? "s" : ""} tracked across all ecosystems.`}
        action={
          <div className="flex items-center gap-2.5">
            {useMock && (
              <span className="text-[10px] font-medium text-[var(--severity-medium)] bg-[var(--severity-medium-bg)] px-2 py-1 rounded-md">
                Demo data
              </span>
            )}
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1">
              <span className="relative flex h-[6px] w-[6px]">
                {!paused && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--severity-critical)]/40 duration-[2000ms]" />
                )}
                <span
                  className={cn(
                    "relative inline-flex h-[6px] w-[6px] rounded-full",
                    paused
                      ? "bg-muted-foreground"
                      : "bg-[var(--severity-critical)]"
                  )}
                />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                {paused ? "Paused" : "Live"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-[11px] h-7 rounded-lg"
              onClick={refreshFeed}
              disabled={loading}
            >
              <RefreshCw
                className={cn("mr-1.5 h-3 w-3", loading && "animate-spin")}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-[11px] h-7 rounded-lg"
              onClick={() => setPaused(!paused)}
            >
              {paused ? (
                <Play className="mr-1.5 h-3 w-3" />
              ) : (
                <Pause className="mr-1.5 h-3 w-3" />
              )}
              {paused ? "Resume" : "Pause"}
            </Button>
          </div>
        }
      />

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border/50 bg-card p-3.5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
            <Globe className="h-3 w-3" />
            Signals Today
          </div>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={totalCount}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[20px] font-bold tabular-nums tracking-tight"
            >
              {totalCount.toLocaleString()}
            </motion.span>
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-[var(--severity-critical)]">
              <TrendingUp className="h-2.5 w-2.5" />
              live
            </span>
          </div>
        </div>
        {(["critical", "high", "medium"] as Severity[]).map((s) => (
          <div
            key={s}
            className={cn(
              "rounded-xl border bg-card p-3.5 transition-all duration-200 cursor-pointer",
              severityFilter === s
                ? `${SEVERITY_CONFIG[s].border} ${SEVERITY_CONFIG[s].bg}`
                : "border-border/50 hover:border-border"
            )}
            onClick={() =>
              setSeverityFilter(severityFilter === s ? null : s)
            }
          >
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
              <span
                className={cn("h-2 w-2 rounded-full", SEVERITY_CONFIG[s].dot)}
              />
              <span className="capitalize">{s}</span>
            </div>
            <span
              className={cn(
                "text-[20px] font-bold tabular-nums tracking-tight",
                SEVERITY_CONFIG[s].color
              )}
            >
              {counts[s as keyof typeof counts]}
            </span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.8}
          />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-[13px] rounded-xl"
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
          {[null, ...severities].map((s) => (
            <button
              key={s ?? "all"}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all capitalize",
                severityFilter === s
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setSeverityFilter(s)}
            >
              {s && (
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    severityFilter === s
                      ? "bg-background/60"
                      : SEVERITY_CONFIG[s].dot
                  )}
                />
              )}
              {s ?? "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid feed */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card overflow-hidden animate-pulse"
            >
              <div className="h-[72px] bg-secondary/60" />
              <div className="p-4 space-y-2.5">
                <div className="h-4 w-3/4 rounded bg-secondary" />
                <div className="h-3 w-1/2 rounded bg-secondary" />
                <div className="h-3 w-full rounded bg-secondary" />
                <div className="h-2 w-2/3 rounded-full bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((event) => {
              const Icon = iconMap[event.type] || ShieldAlert;
              const isNew = event._uid === newestUid;
              const severity = event.severity;
              const threat = threatLevel[severity];

              return (
                <motion.div
                  key={event._uid}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                    layout: { duration: 0.4 },
                  }}
                  className={cn(
                    "group relative rounded-2xl border bg-card overflow-hidden transition-all duration-500 cursor-default",
                    isNew
                      ? "feed-card-new ring-1"
                      : "border-border/50 shadow-[0_1px_3px_oklch(0_0_0/0.04)] hover:shadow-[0_4px_20px_oklch(0_0_0/0.08)] hover:-translate-y-1"
                  )}
                  style={
                    isNew
                      ? ({
                          borderColor: `var(--severity-${severity})`,
                          "--ring-color": `var(--severity-${severity}-ring)`,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  {/* Colored header panel — like pump.fun image area */}
                  <div
                    className="relative flex items-center gap-3.5 px-4 py-3.5"
                    style={{
                      background: `linear-gradient(135deg, var(--severity-${severity}-bg) 0%, var(--severity-${severity}-bg) 60%, transparent 100%)`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-500",
                        SEVERITY_CONFIG[severity].border,
                        "bg-card/80 backdrop-blur-sm"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-transform duration-500",
                          SEVERITY_CONFIG[severity].color,
                          isNew && "scale-110"
                        )}
                        strokeWidth={1.8}
                      />
                      {/* Pulse ring */}
                      {isNew && (
                        <motion.div
                          className="absolute inset-0 rounded-xl border-2"
                          style={{
                            borderColor: `var(--severity-${severity})`,
                          }}
                          initial={{ opacity: 0.6, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.6 }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                      )}
                    </div>

                    {/* Title + type */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[13px] font-bold leading-snug tracking-tight line-clamp-2">
                        {event.title}
                      </h3>
                      <span className="text-[11px] font-medium text-muted-foreground capitalize">
                        {event.type.replace(/_/g, " ").toLowerCase()}
                      </span>
                    </div>

                    {/* NEW flash badge */}
                    {isNew && (
                      <motion.div
                        className="absolute top-2.5 right-3"
                        initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }}
                      >
                        <span className="flex items-center gap-0.5 rounded-full bg-[var(--severity-critical)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                          <Zap className="h-2.5 w-2.5" />
                          New
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="px-4 pb-4 pt-3 space-y-3">
                    {/* Meta row: package + ecosystem + time */}
                    <div className="flex items-center gap-2 text-[11px]">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          SEVERITY_CONFIG[severity].dot
                        )}
                      />
                      <code className="font-mono font-semibold text-foreground/80 truncate">
                        {event.packageName}
                      </code>
                      <span className="text-muted-foreground/50">&middot;</span>
                      <span className="text-muted-foreground font-medium">
                        {event.ecosystem}
                      </span>
                      <span className="ml-auto text-[10px] font-mono tabular-nums text-muted-foreground/50">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>

                    {/* Threat level bar — like pump.fun market cap bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-muted-foreground uppercase tracking-wide">
                          Threat Level
                        </span>
                        <span
                          className={cn(
                            "font-bold uppercase tracking-wide",
                            SEVERITY_CONFIG[severity].color
                          )}
                        >
                          {threat.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: `var(--severity-${severity})`,
                          }}
                          initial={isNew ? { width: 0 } : undefined}
                          animate={{ width: `${threat.pct}%` }}
                          transition={{
                            duration: isNew ? 0.8 : 0.3,
                            ease: [0.16, 1, 0.3, 1],
                            delay: isNew ? 0.2 : 0,
                          }}
                        />
                      </div>
                    </div>

                    {/* Severity badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset",
                          SEVERITY_CONFIG[severity].badge
                        )}
                      >
                        {severity === "critical" && (
                          <Zap className="h-2.5 w-2.5" />
                        )}
                        {SEVERITY_CONFIG[severity].label}
                      </span>
                      {event.sourceName && (
                        <span className="text-[10px] text-muted-foreground/50 bg-muted/50 rounded px-1.5 py-0.5">
                          {event.sourceName}
                        </span>
                      )}
                      {event.sourceUrl && (
                        <a
                          href={event.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground/50 hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Ambient card glow for new items */}
                  {isNew && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        boxShadow: `0 0 30px var(--severity-${severity}-bg), 0 0 60px var(--severity-${severity}-bg)`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-border/80 bg-card shadow-sm py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary mx-auto mb-4">
                <Radio
                  className="h-5 w-5 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-[14px] font-semibold">No events found</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
