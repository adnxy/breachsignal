"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
  { value: "50K+", label: "Advisories tracked", sub: "across all ecosystems" },
  { value: "<30s", label: "Alert delivery", sub: "from disclosure to notification" },
  { value: "24/7", label: "Continuous monitoring", sub: "zero downtime coverage" },
  { value: "6", label: "Package ecosystems", sub: "npm, PyPI, Go, Maven, RubyGems, NuGet" },
];

const logos = [
  "Vercel", "Supabase", "Railway", "Resend", "Dub", "Cal.com",
];

export function SocialProof() {
  return (
    <section className="relative border-t border-border/40">
      {/* Trust logos */}
      <div className="border-b border-border/30">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6 py-8 sm:py-10">
          <motion.p
            className="mb-6 sm:mb-8 text-center text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by engineering teams at
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {logos.map((name) => (
              <span
                key={name}
                className="text-[13px] sm:text-[14px] font-semibold tracking-[-0.02em] text-foreground/[0.12] select-none"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-border/30">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center md:px-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease }}
            >
              <p className="text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-[-0.04em] tabular-nums">{stat.value}</p>
              <p className="mt-1 sm:mt-1.5 text-[12px] sm:text-[13px] font-semibold text-foreground/70">{stat.label}</p>
              <p className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground/40 hidden sm:block">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
