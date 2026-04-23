"use client";

import Link from "next/link";
import { ArrowRight, GitBranch, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { LiveFeedPreview } from "./live-feed-preview";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 pb-20 sm:pb-28 pt-20 sm:pt-28 md:pt-36">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 duration-[2500ms]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Monitoring <span className="font-medium text-foreground tabular-nums">28,345</span> packages
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease }}
          >
            Know the moment your
            <br className="hidden sm:block" />{" "}
            stack is <span className="text-[var(--severity-critical)]">at risk</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-md text-base text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease }}
          >
            Real-time alerts for dependency vulnerabilities, package compromises, and supply-chain incidents.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease }}
          >
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 w-full sm:w-auto justify-center"
            >
              <GitBranch className="h-4 w-4" strokeWidth={1.8} />
              Import from GitHub
            </Link>
            <Link
              href="/dashboard/feed"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted w-full sm:w-auto justify-center"
            >
              View Live Feed
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease }}
          >
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" strokeWidth={1.8} />
              No code access required
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" strokeWidth={1.8} />
              Alerts in under 30s
            </span>
            <span className="flex items-center gap-1.5">
              <GitBranch className="h-3.5 w-3.5" strokeWidth={1.8} />
              Works with any repo
            </span>
          </motion.div>
        </div>

        {/* Feed Section */}
        <motion.div
          className="mt-20 sm:mt-28"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.32, ease }}
        >
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-border" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Latest breaches
            </span>
            <span className="h-px w-12 bg-border" />
          </div>
          <LiveFeedPreview />
        </motion.div>
      </div>
    </section>
  );
}
