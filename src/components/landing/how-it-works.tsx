"use client";

import { motion } from "framer-motion";
import { Link2, Scan, BellRing } from "lucide-react";

const steps = [
  { number: "01", icon: Link2, title: "Connect your dependencies", description: "Upload a package.json, paste a lockfile, or manually search and add the packages you want to monitor." },
  { number: "02", icon: Scan, title: "We monitor live advisories", description: "Our system continuously scrapes GitHub Security Advisories, CVE databases, and registry feeds for new threats." },
  { number: "03", icon: BellRing, title: "Get notified instantly", description: "When a vulnerability or suspicious event affects your stack, you know immediately via Slack, email, or PagerDuty." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border bg-muted/30 py-24 md:py-32">
      <div className="mx-auto max-w-[1080px] px-6">
        <motion.div
          className="mx-auto max-w-md text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-serif text-[2rem] font-[400] tracking-[-0.02em] md:text-[2.5rem]">
            Three steps to peace of mind
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
            Set up in under two minutes. No configuration required.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="rounded-2xl border border-border bg-card p-7 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <step.icon className="h-[17px] w-[17px] text-foreground/80" strokeWidth={1.8} />
                </div>
                <span className="font-serif text-[28px] font-[350] leading-none text-muted-foreground/50 select-none">{step.number}</span>
              </div>
              <h3 className="text-[15px] font-semibold">{step.title}</h3>
              <p className="mt-2 text-[13px] text-muted-foreground leading-[1.7]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
