"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Eye, Layers } from "lucide-react";

const stats = [
  { icon: ShieldCheck, value: "50K+", label: "Advisories tracked" },
  { icon: Zap, value: "<30s", label: "Alert delivery" },
  { icon: Eye, value: "24/7", label: "Continuous monitoring" },
  { icon: Layers, value: "npm, pypi", label: "Ecosystem support" },
];

export function SocialProof() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-[1080px] px-6 py-14">
        <motion.p
          className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Trusted by modern engineering teams
        </motion.p>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <stat.icon className="h-[18px] w-[18px] text-foreground/70" strokeWidth={1.8} />
              </div>
              <p className="text-[22px] font-bold tracking-[-0.03em]">{stat.value}</p>
              <p className="mt-1 text-[12px] font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
