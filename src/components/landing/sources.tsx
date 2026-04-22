"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Database, Shield, FileWarning, Bug, Lock, Newspaper,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const sourceCategories = [
  {
    icon: Database,
    name: "CVE Databases",
    sources: ["NVD / NIST", "MITRE CVE", "VulnDB"],
    color: "text-[var(--severity-critical)]",
    bg: "bg-[var(--severity-critical-bg)]",
    ring: "ring-[var(--severity-critical-ring)]",
  },
  {
    icon: Shield,
    name: "Security Advisories",
    sources: ["GitHub Advisory", "OSV.dev", "RustSec"],
    color: "text-[var(--severity-high)]",
    bg: "bg-[var(--severity-high-bg)]",
    ring: "ring-[var(--severity-high-ring)]",
  },
  {
    icon: FileWarning,
    name: "Package Registries",
    sources: ["npm Registry", "PyPI", "crates.io"],
    color: "text-[var(--severity-medium)]",
    bg: "bg-[var(--severity-medium-bg)]",
    ring: "ring-[var(--severity-medium-ring)]",
  },
  {
    icon: Bug,
    name: "Exploit Intelligence",
    sources: ["Exploit-DB", "CISA KEV", "PoC-in-GitHub"],
    color: "text-foreground/60",
    bg: "bg-muted/50",
    ring: "ring-border/40",
  },
  {
    icon: Newspaper,
    name: "Threat Feeds",
    sources: ["Snyk Intel", "Sonatype OSS", "Phylum"],
    color: "text-[var(--success)]",
    bg: "bg-[var(--success)]/8",
    ring: "ring-[var(--success)]/15",
  },
  {
    icon: Lock,
    name: "Malware Scanners",
    sources: ["Socket.dev", "Sandworm", "Packj"],
    color: "text-foreground/50",
    bg: "bg-muted/40",
    ring: "ring-border/30",
  },
];

export function Sources() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 border-t border-border/30">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <motion.div
          className="mx-auto max-w-lg text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/40">
            Intelligence sources
          </p>
          <h2 className="font-serif text-[1.5rem] sm:text-[2rem] font-[400] tracking-[-0.02em] md:text-[2.75rem]">
            We crawl the web so you don&apos;t have to
          </h2>
          <p className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] text-muted-foreground/60 leading-relaxed">
            Continuously aggregating data from 100+ vulnerability databases, advisory feeds, and threat intelligence sources.
          </p>
        </motion.div>

        {/* Source grid */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sourceCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="group rounded-xl border border-border/40 bg-card p-4 sm:p-5 transition-colors hover:border-border/70"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.5, ease }}
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className={cn("flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl ring-1", cat.bg, cat.ring)}>
                  <cat.icon className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", cat.color)} strokeWidth={1.8} />
                </div>
                <h3 className="text-[12px] sm:text-[13px] font-semibold">{cat.name}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.sources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center rounded-md border border-border/30 bg-muted/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-foreground/50"
                  >
                    {source}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-md border border-dashed border-border/30 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-muted-foreground/30">
                  +more
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          className="mt-8 sm:mt-12 flex items-center justify-center gap-6 sm:gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {[
            { value: "100+", label: "Sources" },
            { value: "6", label: "Ecosystems" },
            { value: "<30s", label: "Latency" },
            { value: "24/7", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[18px] sm:text-[20px] font-bold tracking-[-0.03em] tabular-nums">{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground/30 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
