"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Radio, Zap, BarChart3, MessageSquare,
  GitBranch, ShieldCheck, Lock, Check, Globe,
  Upload, ArrowRight, Loader2,
  CheckCircle2, Search,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const severityDot: Record<string, string> = {
  critical: "bg-[var(--severity-critical)]",
  high: "bg-[var(--severity-high)]",
  medium: "bg-[var(--severity-medium)]",
  low: "bg-[var(--severity-low)]",
};

const severityBar: Record<string, string> = {
  Critical: "bg-[var(--severity-critical)]",
  High: "bg-[var(--severity-high)]",
  Medium: "bg-[var(--severity-medium)]",
  Low: "bg-[var(--severity-low)]",
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400",
  Go: "bg-cyan-400",
  Dart: "bg-sky-400",
  Python: "bg-yellow-500",
  Rust: "bg-orange-400",
  HCL: "bg-purple-400",
};

const DEMO_REPOS = [
  { name: "web-app", owner: "acme-corp", lang: "TypeScript", private: true, deps: 142 },
  { name: "api-server", owner: "acme-corp", lang: "Go", private: true, deps: 38 },
  { name: "design-system", owner: "acme-corp", lang: "TypeScript", private: false, deps: 67 },
  { name: "mobile-app", owner: "acme-corp", lang: "Dart", private: true, deps: 91 },
  { name: "auth-service", owner: "acme-corp", lang: "Rust", private: true, deps: 24 },
  { name: "infra", owner: "acme-corp", lang: "HCL", private: true, deps: 15 },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          className="mx-auto max-w-lg text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Capabilities
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to stay secure
          </h2>
        </motion.div>

        {/* GitHub Import — full-width hero card */}
        <motion.div
          className="mb-4 rounded-xl border border-border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="grid md:grid-cols-[1fr_1.2fr]">
            {/* Left */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <GitBranch className="h-5 w-5 text-foreground" strokeWidth={1.7} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                Import from GitHub
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-sm">
                One click to connect. Select your repos, and every dependency gets scanned for known vulnerabilities — automatically, continuously.
              </p>

              <div className="mt-6 space-y-2.5">
                {[
                  "Select repos — we detect manifests automatically",
                  "No code access — only dependency files are read",
                  "Continuous monitoring — re-scans on every push",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2} />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/signup"
                className="mt-8 inline-flex items-center gap-2 self-start rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <GitBranch className="h-3.5 w-3.5" />
                Connect GitHub
                <ArrowRight className="h-3.5 w-3.5 opacity-60" />
              </Link>

              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span>or</span>
                <button className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors underline underline-offset-2">
                  <Upload className="h-3 w-3" />
                  upload package.json
                </button>
                <span className="text-border">·</span>
                <button className="hover:text-foreground transition-colors underline underline-offset-2">
                  add manually
                </button>
              </div>
            </div>

            {/* Right — interactive demo */}
            <div className="border-t md:border-t-0 md:border-l border-border bg-muted/30">
              <GitHubImportDemo />
            </div>
          </div>
        </motion.div>

        {/* 2x2 grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Live breach feed */}
          <motion.div
            className="rounded-xl border border-border p-7 transition-colors hover:bg-muted/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <Radio className="h-5 w-5 text-red-500" strokeWidth={1.7} />
            </div>
            <h3 className="text-base font-semibold tracking-tight">Live breach feed</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Real-time stream of CVEs, malware, and supply-chain incidents across all ecosystems.
            </p>

            <div className="mt-6 rounded-lg border border-border overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40 duration-[2500ms]" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-500">Live</span>
                <span className="text-[10px] text-muted-foreground ml-auto font-mono tabular-nums">3 new</span>
              </div>
              {[
                { severity: "critical", pkg: "lodash", title: "Prototype pollution", time: "2m" },
                { severity: "high", pkg: "axios", title: "SSRF in proxy config", time: "8m" },
                { severity: "critical", pkg: "event-stream", title: "Account compromise", time: "15m" },
              ].map((item, i) => (
                <div key={i} className={cn("flex items-center gap-3 px-4 py-2.5", i < 2 && "border-b border-border")}>
                  <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", severityDot[item.severity])} />
                  <code className="text-xs font-mono font-medium text-foreground/70 w-[72px] shrink-0">{item.pkg}</code>
                  <span className="text-xs text-muted-foreground truncate flex-1">{item.title}</span>
                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Instant alerts */}
          <motion.div
            className="rounded-xl border border-border p-7 transition-colors hover:bg-muted/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.06, duration: 0.6, ease }}
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Zap className="h-5 w-5 text-blue-500" strokeWidth={1.7} />
            </div>
            <h3 className="text-base font-semibold tracking-tight">Instant alerts</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Slack, PagerDuty, Telegram, or email — notified the moment your dependencies are affected.
            </p>

            <div className="mt-6 rounded-lg border border-border p-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">#security-alerts</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Critical vulnerability in <code className="font-mono text-[var(--severity-critical)] font-medium">lodash</code> &lt; 4.17.21 — prototype pollution allows remote code execution.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded bg-[var(--severity-critical-bg)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--severity-critical)] uppercase">Critical</span>
                <span className="text-[10px] text-muted-foreground">2 min ago</span>
              </div>
            </div>
          </motion.div>

          {/* Severity scoring */}
          <motion.div
            className="rounded-xl border border-border p-7 transition-colors hover:bg-muted/30 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.12, duration: 0.6, ease }}
          >
            <div className="grid md:grid-cols-[1fr_1.4fr] gap-8">
              <div>
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <BarChart3 className="h-5 w-5 text-orange-500" strokeWidth={1.7} />
                </div>
                <h3 className="text-base font-semibold tracking-tight">Severity scoring</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  CVSS-based scoring with contextual analysis. Know what&apos;s urgent vs what can wait.
                </p>

                <div className="mt-5 space-y-2">
                  {[
                    "CVSS v3.1 base + temporal scores",
                    "Exploit maturity & availability",
                    "Contextual priority for your stack",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-orange-500 shrink-0" strokeWidth={2} />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Severity breakdown card */}
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
                    <span className="text-xs font-medium">Vulnerability Summary</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums">18 total</span>
                </div>

                <div className="p-4 space-y-3">
                  {[
                    { label: "Critical", count: 3, pct: 17, score: "9.8" },
                    { label: "High", count: 5, pct: 28, score: "7.5" },
                    { label: "Medium", count: 8, pct: 44, score: "5.3" },
                    { label: "Low", count: 2, pct: 11, score: "2.1" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={cn("h-2 w-2 rounded-full", severityBar[item.label])} />
                          <span className="text-xs font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground">CVSS {item.score}</span>
                          <span className="text-xs font-mono font-semibold tabular-nums w-4 text-right">{item.count}</span>
                        </div>
                      </div>
                      <div className="h-1 rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full", severityBar[item.label])} style={{ width: `${item.pct + 20}%`, opacity: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border px-4 py-2">
                  <span className="text-[10px] text-muted-foreground">3 require immediate action</span>
                  <span className="text-[10px] font-medium text-[var(--severity-critical)]">3 exploitable</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Interactive GitHub Import Demo */
function GitHubImportDemo() {
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 1, 4]));
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filtered = DEMO_REPOS.filter(
    (r) => r.name.toLowerCase().includes(searchValue.toLowerCase()) ||
           r.owner.toLowerCase().includes(searchValue.toLowerCase())
  );

  function toggle(i: number) {
    if (importing || done) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleImport() {
    if (selected.size === 0 || importing) return;
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    }, 1800);
  }

  const totalDeps = DEMO_REPOS.filter((_, i) => selected.has(i)).reduce((sum, r) => sum + r.deps, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-muted">
          <GitBranch className="h-3 w-3 text-foreground" strokeWidth={1.8} />
        </div>
        <span className="text-xs font-medium">acme-corp</span>
        <span className="text-[10px] text-muted-foreground ml-auto">{DEMO_REPOS.length} repos</span>
      </div>

      <div className="relative border-b border-border">
        <Search className="absolute left-3.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter repositories..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full bg-transparent pl-8.5 pr-3 py-2 text-xs placeholder:text-muted-foreground outline-none"
        />
      </div>

      <div className="flex-1 divide-y divide-border overflow-hidden">
        {filtered.map((repo) => {
          const originalIndex = DEMO_REPOS.indexOf(repo);
          const isSelected = selected.has(originalIndex);
          return (
            <button
              key={repo.name}
              type="button"
              onClick={() => toggle(originalIndex)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer",
                isSelected ? "bg-muted/50" : "hover:bg-muted/30"
              )}
            >
              <div className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
                isSelected ? "border-foreground bg-foreground" : "border-border"
              )}>
                {isSelected && <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />}
              </div>
              {repo.private ? (
                <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
              ) : (
                <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
              <span className="text-xs font-mono flex-1 min-w-0">
                <span className="text-muted-foreground">{repo.owner}/</span>
                <span className="font-medium text-foreground">{repo.name}</span>
              </span>
              <span className={cn("h-2 w-2 rounded-full shrink-0", LANG_COLORS[repo.lang] || "bg-gray-400")} />
              <span className="text-[10px] text-muted-foreground w-[56px] text-right">{repo.lang}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground font-medium">
            {selected.size} repo{selected.size !== 1 ? "s" : ""} selected
          </span>
          {selected.size > 0 && (
            <span className="text-[9px] text-muted-foreground">
              ~{totalDeps} dependencies to scan
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleImport}
          disabled={selected.size === 0 || importing}
          className={cn(
            "flex h-7 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all",
            done
              ? "bg-emerald-500 text-white"
              : "bg-foreground text-background hover:opacity-90",
            (selected.size === 0 || importing) && !done && "opacity-40"
          )}
        >
          {importing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Scanning...
            </>
          ) : done ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Imported
            </>
          ) : (
            <>
              Import {selected.size}
              <ArrowRight className="h-3 w-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
