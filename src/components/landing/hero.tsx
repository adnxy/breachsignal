"use client";

import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { LiveFeedPreview } from "./live-feed-preview";
import dynamic from "next/dynamic";

const SonarBackground = dynamic(
  () => import("./sonar-bg").then((m) => m.SonarBackground),
  { ssr: false }
);

const ease = [0.16, 1, 0.3, 1] as const;

const integrationIcons = [
  {
    name: "Slack",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
  },
  {
    name: "PagerDuty",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M16.965 1.18C15.085.164 13.769 0 10.683 0H3.73v14.55h6.926c2.743 0 4.8-.164 6.61-1.37 1.975-1.303 3.004-3.47 3.004-6.074 0-2.879-1.193-4.86-3.305-5.926zM11.43 10.074H8.078V4.449h3.024c2.853 0 4.36.852 4.36 2.715 0 2.11-1.588 2.91-4.032 2.91zM3.73 18.273h4.348V24H3.73z" />
      </svg>
    ),
  },
  {
    name: "Jira",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24.013 12.486V1.005A1.005 1.005 0 0 0 23.013 0z" />
      </svg>
    ),
  },
  {
    name: "Email",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <SonarBackground />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-12 sm:pb-28 pt-14 sm:pt-28 md:pt-36">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 py-1.5 text-xs text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 duration-[2500ms]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Monitoring <span className="font-medium text-foreground tabular-nums">28,345</span> packages
            </div>
          </motion.div>

          <motion.h1
            className="text-[1.75rem] leading-[1.15] font-bold tracking-tight sm:text-5xl md:text-[3.5rem] md:leading-[1.1]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease }}
          >
            Know the moment your
            <br className="hidden sm:block" />{" "}
            dependencies are{" "}
            <span className="text-[var(--brand)]">compromised</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 sm:mt-6 max-w-lg text-sm text-muted-foreground sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease }}
          >
            Real-time vulnerability monitoring for your software supply chain. Scan, detect, and respond in seconds.
          </motion.p>

          <motion.div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease }}
          >
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90 w-full sm:w-auto justify-center"
            >
              <GitBranch className="h-4 w-4" strokeWidth={1.8} />
              Start for free
              <ArrowRight className="h-3.5 w-3.5 opacity-40 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/dashboard/feed"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 w-full sm:w-auto justify-center"
            >
              View Live Feed
            </Link>
          </motion.div>

          {/* Integration icons */}
          <motion.div
            className="mt-6 sm:mt-10 flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32, ease }}
          >
            <span className="text-[11px] text-muted-foreground/50 mr-2.5 hidden sm:inline">Works with</span>
            {integrationIcons.map((item) => (
              <div
                key={item.name}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/25 transition-colors hover:text-muted-foreground/50"
                title={item.name}
              >
                {item.icon}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Feed Section */}
        <motion.div
          className="mt-12 sm:mt-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.36, ease }}
        >
          <LiveFeedPreview />
        </motion.div>
      </div>
    </section>
  );
}
