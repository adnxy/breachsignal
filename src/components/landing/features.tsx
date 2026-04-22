"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Radio, Bell, Upload, BarChart3, MessageSquare, Zap,
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

export function Features() {
  return (
    <section id="features" className="relative py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <motion.div
          className="mx-auto max-w-lg text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/40">
            Capabilities
          </p>
          <h2 className="font-serif text-[1.5rem] sm:text-[2rem] font-[400] tracking-[-0.02em] md:text-[2.75rem]">
            Everything you need to stay secure
          </h2>
        </motion.div>

        {/* 2x2 grid — all cards equal */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {/* Live breach feed */}
          <motion.div
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-card p-5 sm:p-7 transition-colors hover:border-border/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="mb-4 sm:mb-5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--severity-critical)]/8">
              <Radio className="h-[17px] w-[17px] text-[var(--severity-critical)]" strokeWidth={1.7} />
            </div>
            <h3 className="text-[14px] sm:text-[16px] font-semibold tracking-[-0.02em]">Live breach feed</h3>
            <p className="mt-2 text-[13px] text-muted-foreground/50 leading-relaxed">
              Real-time stream of CVEs, malware, and supply-chain incidents across all ecosystems.
            </p>

            {/* Mini feed */}
            <div className="mt-4 sm:mt-6 rounded-xl border border-border/30 bg-background overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border/20 px-4 py-2">
                <span className="relative flex h-[5px] w-[5px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/40 duration-[2500ms]" />
                  <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[var(--success)]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--success)]">Live</span>
                <span className="text-[10px] text-muted-foreground/25 ml-auto font-mono tabular-nums">3 new</span>
              </div>
              {[
                { severity: "critical", pkg: "lodash", title: "Prototype pollution", time: "2m" },
                { severity: "high", pkg: "axios", title: "SSRF in proxy config", time: "8m" },
                { severity: "critical", pkg: "event-stream", title: "Account compromise", time: "15m" },
              ].map((item, i) => (
                <div key={i} className={cn("flex items-center gap-3 px-4 py-2.5", i < 2 && "border-b border-border/15")}>
                  <span className={cn("h-[5px] w-[5px] rounded-full shrink-0", severityDot[item.severity])} />
                  <code className="text-[11px] font-mono font-medium text-foreground/55 w-[72px] shrink-0">{item.pkg}</code>
                  <span className="text-[11px] text-muted-foreground/35 truncate flex-1">{item.title}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/20 tabular-nums shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Instant alerts */}
          <motion.div
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-card p-5 sm:p-7 transition-colors hover:border-border/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.06, duration: 0.6, ease }}
          >
            <div className="mb-4 sm:mb-5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--accent-color)]/8">
              <Zap className="h-[17px] w-[17px] text-[var(--accent-color)]" strokeWidth={1.7} />
            </div>
            <h3 className="text-[14px] sm:text-[16px] font-semibold tracking-[-0.02em]">Instant alerts</h3>
            <p className="mt-2 text-[13px] text-muted-foreground/50 leading-relaxed">
              Slack, PagerDuty, Telegram, or email — notified the moment your dependencies are affected.
            </p>

            {/* Alert preview */}
            <div className="mt-4 sm:mt-6 rounded-xl border border-border/30 bg-background p-4">
              <div className="flex items-center gap-1.5 mb-2.5">
                <MessageSquare className="h-3 w-3 text-muted-foreground/30" />
                <span className="text-[10px] font-medium text-muted-foreground/35">#security-alerts</span>
              </div>
              <p className="text-[12px] text-foreground/50 leading-relaxed">
                Critical vulnerability in <code className="font-mono text-[var(--severity-critical)] font-medium">lodash</code> &lt; 4.17.21 — prototype pollution allows remote code execution.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-md bg-[var(--severity-critical-bg)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--severity-critical)] uppercase">Critical</span>
                <span className="text-[9px] text-muted-foreground/25">2 min ago</span>
              </div>
            </div>
          </motion.div>

          {/* Drop your manifest */}
          <motion.div
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-card p-5 sm:p-7 transition-colors hover:border-border/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.12, duration: 0.6, ease }}
          >
            <div className="mb-4 sm:mb-5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--success)]/8">
              <Upload className="h-[17px] w-[17px] text-[var(--success)]" strokeWidth={1.7} />
            </div>
            <h3 className="text-[14px] sm:text-[16px] font-semibold tracking-[-0.02em]">Drop your manifest</h3>
            <p className="mt-2 text-[13px] text-muted-foreground/50 leading-relaxed">
              Upload package.json, requirements.txt, or go.mod — every dependency tracked instantly.
            </p>

            {/* Upload preview */}
            <div className="mt-4 sm:mt-6 rounded-xl border border-dashed border-border/40 bg-foreground/[0.015] p-5 text-center">
              <Upload className="h-5 w-5 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-[11px] font-medium text-foreground/40">package.json</p>
              <p className="text-[10px] text-[var(--success)] font-medium mt-1">147 packages detected</p>
            </div>
          </motion.div>

          {/* Severity scoring */}
          <motion.div
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-card p-5 sm:p-7 transition-colors hover:border-border/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.18, duration: 0.6, ease }}
          >
            <div className="mb-4 sm:mb-5 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[var(--severity-high)]/8">
              <BarChart3 className="h-[17px] w-[17px] text-[var(--severity-high)]" strokeWidth={1.7} />
            </div>
            <h3 className="text-[14px] sm:text-[16px] font-semibold tracking-[-0.02em]">Severity scoring</h3>
            <p className="mt-2 text-[13px] text-muted-foreground/50 leading-relaxed">
              CVSS-based scoring with contextual analysis. Know what&apos;s urgent vs what can wait.
            </p>

            {/* Severity bars */}
            <div className="mt-6 space-y-2.5">
              {[
                { label: "Critical", count: 3, pct: 17 },
                { label: "High", count: 5, pct: 28 },
                { label: "Medium", count: 8, pct: 44 },
                { label: "Low", count: 2, pct: 11 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground/35 w-[44px] text-right font-medium">{item.label}</span>
                  <div className="flex-1 h-[5px] rounded-full bg-foreground/[0.04] overflow-hidden">
                    <div className={cn("h-full rounded-full", severityBar[item.label])} style={{ width: `${item.pct + 20}%`, opacity: 0.6 }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/30 w-[14px] tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
