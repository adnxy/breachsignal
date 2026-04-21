"use client";

import { motion } from "framer-motion";
import {
  Globe, Database, FileWarning, Shield, Bug, Lock, Radio, Newspaper,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const sourceCategories = [
  {
    icon: Database,
    name: "CVE Databases",
    sources: ["NVD / NIST", "MITRE CVE", "VulnDB"],
    color: "text-[var(--severity-critical)]",
    bg: "bg-[var(--severity-critical-bg)]",
  },
  {
    icon: Shield,
    name: "Security Advisories",
    sources: ["GitHub Advisory", "OSV.dev", "RustSec"],
    color: "text-[var(--severity-high)]",
    bg: "bg-[var(--severity-high-bg)]",
  },
  {
    icon: FileWarning,
    name: "Package Registries",
    sources: ["npm Registry", "PyPI", "crates.io"],
    color: "text-[var(--severity-medium)]",
    bg: "bg-[var(--severity-medium-bg)]",
  },
  {
    icon: Bug,
    name: "Exploit Intelligence",
    sources: ["Exploit-DB", "CISA KEV", "PoC-in-GitHub"],
    color: "text-[var(--accent-color)]",
    bg: "bg-[var(--accent-color-subtle)]",
  },
  {
    icon: Newspaper,
    name: "Threat Feeds",
    sources: ["Snyk Intel", "Sonatype OSS", "Phylum"],
    color: "text-[var(--success)]",
    bg: "bg-[var(--success)]/10",
  },
  {
    icon: Lock,
    name: "Malware Scanners",
    sources: ["Socket.dev", "Sandworm", "Packj"],
    color: "text-foreground/70",
    bg: "bg-muted",
  },
];

export function Sources() {
  return (
    <section id="sources" className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-[1080px] px-6">
        <motion.div
          className="mx-auto max-w-lg text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-[12px] font-semibold text-muted-foreground shadow-sm">
            <Globe className="h-3.5 w-3.5 text-[var(--accent-color)]" strokeWidth={2} />
            100+ sources monitored
          </div>
          <h2 className="font-serif text-[2rem] font-[400] tracking-[-0.02em] md:text-[2.5rem]">
            We crawl the web so you don&apos;t have to
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
            BreachSignal continuously aggregates data from over 100 vulnerability databases,
            advisory feeds, package registries, and threat intelligence sources — then
            notifies you the instant something affects your stack.
          </p>
        </motion.div>

        {/* Source grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sourceCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-border hover:shadow-[0_2px_8px_oklch(0_0_0/0.06)]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.bg}`}>
                  <cat.icon className={`h-[18px] w-[18px] ${cat.color}`} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold">{cat.name}</h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.sources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-foreground/70"
                  >
                    {source}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-lg border border-dashed border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  +more
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats row */}
        <motion.div
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
        >
          {[
            { value: "100+", label: "Data sources" },
            { value: "6", label: "Ecosystems" },
            { value: "<30s", label: "Detection latency" },
            { value: "24/7", label: "Continuous crawling" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-[24px] font-bold tracking-[-0.03em]">{stat.value}</p>
              <p className="mt-1 text-[12px] font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
