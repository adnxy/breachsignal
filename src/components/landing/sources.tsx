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
  },
  {
    icon: Shield,
    name: "Security Advisories",
    sources: ["GitHub Advisory", "OSV.dev", "RustSec"],
  },
  {
    icon: FileWarning,
    name: "Package Registries",
    sources: ["npm Registry", "PyPI", "crates.io"],
  },
  {
    icon: Bug,
    name: "Exploit Intelligence",
    sources: ["Exploit-DB", "CISA KEV", "PoC-in-GitHub"],
  },
  {
    icon: Newspaper,
    name: "Threat Feeds",
    sources: ["Snyk Intel", "Sonatype OSS", "Phylum"],
  },
  {
    icon: Lock,
    name: "Malware Scanners",
    sources: ["Socket.dev", "Sandworm", "Packj"],
  },
];

export function Sources() {
  return (
    <section className="relative py-20 sm:py-28 md:py-36 border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          className="mx-auto max-w-lg text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Intelligence sources
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            We crawl the web so you don&apos;t have to
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Continuously aggregating data from 100+ vulnerability databases, advisory feeds, and threat intelligence sources.
          </p>
        </motion.div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sourceCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="rounded-xl border border-border p-5 transition-colors hover:bg-muted/30"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.5, ease }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <cat.icon className="h-4 w-4 text-foreground" strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-semibold">{cat.name}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.sources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center rounded-md border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
                  >
                    {source}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-md border border-dashed border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                  +more
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex items-center justify-center gap-10 md:gap-16"
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
              <p className="text-2xl font-bold tracking-tight tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
