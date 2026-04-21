"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SeverityBadge } from "@/components/shared/severity-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_FEED } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Severity, SignalType } from "@/types";
import {
  Search, Pause, Play, ShieldAlert, AlertTriangle, Bug,
  Trash2, FileText, UserX, Lock, Radio, ExternalLink, RefreshCw,
} from "lucide-react";

const iconMap: Record<SignalType, React.ElementType> = {
  VULNERABILITY: ShieldAlert, MALWARE: Bug, COMPROMISE: Lock,
  DEPRECATION: FileText, LICENSE_CHANGE: FileText, MAINTAINER_CHANGE: UserX,
  REGISTRY_REMOVAL: Trash2, SUSPICIOUS_RELEASE: AlertTriangle,
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

export default function LiveFeedPage() {
  const [events, setEvents] = useState<
    { id: string; type: SignalType; title: string; severity: Severity; packageName: string; ecosystem: string; timestamp: Date; description: string; sourceUrl?: string; sourceName?: string }[]
  >([]);
  const [paused, setPaused] = useState(false);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | null>(null);
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFetchRef = useRef<string | null>(null);

  const fetchFeed = useCallback(async (isPolling = false) => {
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
        setEvents(MOCK_FEED.map((e) => ({ ...e, sourceUrl: undefined, sourceName: undefined })));
        setLoading(false);
        return;
      }

      setUseMock(false);
      const mapped = items.map((item) => ({
        id: item.id,
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

      // Detect new items since last fetch
      if (isPolling && lastFetchRef.current) {
        const newIds = new Set(mapped.filter((m) => m.id > lastFetchRef.current!).map((m) => m.id));
        if (newIds.size > 0) {
          setNewEventIds(newIds);
          setTimeout(() => setNewEventIds(new Set()), 1500);
        }
      }

      if (mapped.length > 0) {
        lastFetchRef.current = mapped[0].id;
      }

      setEvents(mapped);
    } catch {
      // On error, fall back to mock data
      if (!events.length) {
        setUseMock(true);
        setEvents(MOCK_FEED.map((e) => ({ ...e, sourceUrl: undefined, sourceName: undefined })));
      }
    } finally {
      setLoading(false);
    }
  }, [severityFilter, search]);

  const refreshFeed = useCallback(async () => {
    setLoading(true);
    await fetchFeed(false);
  }, [fetchFeed]);

  // Initial fetch
  useEffect(() => {
    fetchFeed(false);
  }, [fetchFeed]);

  // Polling every 30s when not paused
  useEffect(() => {
    if (paused) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    pollRef.current = setInterval(() => fetchFeed(true), 30_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [paused, fetchFeed]);

  const filtered = events.filter((e) => {
    if (severityFilter && e.severity !== severityFilter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.packageName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
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
                {!paused && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.72_0.12_175_/_0.5)] duration-[2000ms]" />}
                <span className={cn("relative inline-flex h-[6px] w-[6px] rounded-full", paused ? "bg-muted-foreground" : "bg-[oklch(0.72_0.12_175)]")} />
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">{paused ? "Paused" : "Live"}</span>
            </div>
            <Button variant="outline" size="sm" className="text-[11px] h-7 rounded-lg" onClick={refreshFeed} disabled={loading}>
              <RefreshCw className={cn("mr-1.5 h-3 w-3", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="text-[11px] h-7 rounded-lg" onClick={() => setPaused(!paused)}>
              {paused ? <Play className="mr-1.5 h-3 w-3" /> : <Pause className="mr-1.5 h-3 w-3" />}
              {paused ? "Resume" : "Pause"}
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.8} />
          <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-[13px] rounded-xl" />
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
          {[null, ...severities].map((s) => (
            <button
              key={s ?? "all"}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all capitalize",
                severityFilter === s ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setSeverityFilter(s)}
            >
              {s ?? "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Feed list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/80 bg-card shadow-sm p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-secondary" />
                  <div className="h-3 w-full rounded bg-secondary" />
                  <div className="h-3 w-1/3 rounded bg-secondary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => {
            const Icon = iconMap[event.type] || ShieldAlert;
            const isNew = newEventIds.has(event.id);
            const minutes = Math.round((Date.now() - event.timestamp.getTime()) / 60000);
            const timeLabel = minutes < 60 ? `${minutes}m ago` : minutes < 1440 ? `${Math.floor(minutes / 60)}h ago` : `${Math.floor(minutes / 1440)}d ago`;

            const sevVar = `--severity-${event.severity}` as string;

            return (
              <div
                key={event.id}
                className={cn(
                  "group rounded-2xl border bg-card transition-all duration-200 hover:shadow-[0_2px_8px_oklch(0_0_0/0.04),0_8px_24px_oklch(0_0_0/0.05)] hover:-translate-y-[1px]",
                  isNew ? "ring-2 ring-foreground/10 border-border/80" : "border-border/50 shadow-[0_0_0_1px_oklch(0_0_0/0.02),0_1px_2px_oklch(0_0_0/0.03)]",
                )}
                style={{ animation: isNew ? "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" : undefined }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200"
                      style={{ backgroundColor: `var(${sevVar}-bg)` }}
                    >
                      <Icon className="h-[18px] w-[18px] transition-colors duration-200" style={{ color: `var(${sevVar})` }} strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="text-[14px] font-semibold leading-snug tracking-tight">{event.title}</h3>
                        <span className="text-[11px] text-muted-foreground tabular-nums shrink-0 pt-0.5">{timeLabel}</span>
                      </div>

                      <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{event.description}</p>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://www.npmjs.com/package/${event.packageName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono font-semibold bg-secondary rounded-md px-2 py-0.5 hover:underline hover:bg-secondary/80 transition-colors"
                        >
                          {event.packageName}
                        </a>
                        <span className="text-[11px] text-muted-foreground">{event.ecosystem}</span>
                        {event.sourceName && (
                          <span className="text-[10px] text-muted-foreground/60 bg-muted/60 px-2 py-0.5 rounded-md">{event.sourceName}</span>
                        )}
                        <SeverityBadge severity={event.severity} className="ml-auto" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 px-5 py-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] text-muted-foreground">
                    {event.type.replace(/_/g, " ").toLowerCase()}
                  </span>
                  {event.sourceUrl && (
                    <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                      View advisory <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border/80 bg-card shadow-sm py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary mx-auto mb-4">
                <Radio className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-[14px] font-semibold">No events found</p>
              <p className="mt-1 text-[13px] text-muted-foreground">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
