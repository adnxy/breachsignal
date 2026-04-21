"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { LiveFeedPreview } from "./live-feed-preview";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-200px] h-[700px] w-[900px] -translate-x-1/2 bg-gradient-to-b from-foreground/[0.02] to-transparent blur-[100px]" />
      </div>

      <div className="mx-auto max-w-[1080px] px-6 pb-28 pt-20 md:pt-32 lg:pt-40">
        <div className="mx-auto max-w-[640px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-1.5 text-[12px] text-muted-foreground shadow-sm glass-subtle">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
              </span>
              Monitoring <span className="font-semibold text-foreground tabular-nums">12,847</span> packages in real-time
            </div>
          </motion.div>

          <motion.h1
            className="font-serif text-[2.5rem] font-[400] leading-[1.08] tracking-[-0.025em] text-balance sm:text-[3.25rem] md:text-[4.25rem]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease }}
          >
            Know the moment
            <br className="hidden sm:block" />
            your stack is <span className="italic">at risk</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-[420px] text-[16px] leading-[1.7] text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease }}
          >
            Real-time alerts for dependency vulnerabilities, package compromises, and supply-chain incidents.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease }}
          >
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full px-8 text-[14px] font-semibold shadow-[0_1px_2px_oklch(0_0_0/0.1),0_4px_16px_oklch(0_0_0/0.10)] hover:shadow-[0_2px_4px_oklch(0_0_0/0.12),0_8px_24px_oklch(0_0_0/0.12)] transition-all duration-200 hover:-translate-y-px active:translate-y-0 w-full sm:w-auto"
              )}
            >
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/feed"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full px-8 text-[14px] font-semibold w-full sm:w-auto"
              )}
            >
              <Play className="mr-2 h-3.5 w-3.5 fill-current" />
              View Live Feed
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 md:mt-24"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease }}
        >
          <LiveFeedPreview />
        </motion.div>
      </div>
    </section>
  );
}
