"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { LiveFeedPreview } from "./live-feed-preview";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-200px] h-[700px] w-[900px] -translate-x-1/2 bg-gradient-to-b from-foreground/[0.02] to-transparent blur-[100px]" />
      </div>

      <div className="mx-auto max-w-[1080px] px-5 sm:px-6 pb-20 sm:pb-28 pt-16 sm:pt-20 md:pt-32 lg:pt-40">
        <div className="mx-auto max-w-[640px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="mb-6 sm:mb-7 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3.5 py-1.5 text-[11px] sm:text-[12px] text-muted-foreground shadow-sm glass-subtle">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
              </span>
              Monitoring <span className="font-semibold text-foreground tabular-nums">28,345</span> packages
            </div>
          </motion.div>

          <motion.h1
            className="font-serif text-[2rem] font-[400] leading-[1.1] tracking-[-0.025em] text-balance text-foreground sm:text-[3rem] md:text-[4.25rem]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease }}
          >
            Know the moment
            <br className="hidden sm:block" />{" "}
            your stack is <span className="italic text-[var(--severity-critical)]">at risk</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 sm:mt-5 max-w-[380px] sm:max-w-[420px] text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[1.7] text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease }}
          >
            Real-time alerts for dependency vulnerabilities, package compromises, and supply-chain incidents.
          </motion.p>

          <motion.div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease }}
          >
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-[14px] font-semibold text-background shadow-[0_1px_2px_oklch(0_0_0/0.08),0_4px_12px_oklch(0_0_0/0.08)] transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:translate-y-0 w-full sm:w-auto justify-center"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/feed"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-7 py-3 text-[14px] font-medium text-foreground/80 transition-all duration-200 hover:border-border hover:text-foreground w-full sm:w-auto justify-center"
            >
              <Play className="h-3.5 w-3.5 fill-current opacity-60" />
              View Live Feed
            </Link>
          </motion.div>

          <motion.p
            className="mt-5 sm:mt-6 text-[11px] sm:text-[12px] text-muted-foreground/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
          >
            From the creator of{" "}
            <a
              href="https://rnsec.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 underline decoration-border underline-offset-2 hover:text-foreground/70 transition-colors"
            >
              RNSEC
            </a>
          </motion.p>
        </div>

        {/* ─── Feed Section ─── */}
        <motion.div
          className="mt-14 sm:mt-20 md:mt-28"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.32, ease }}
        >
          <div className="mb-6 sm:mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-border" />
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/40">
              Latest breaches
            </span>
            <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-border" />
          </div>
          <LiveFeedPreview />
        </motion.div>
      </div>
    </section>
  );
}
