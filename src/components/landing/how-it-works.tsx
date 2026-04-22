"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Upload a manifest or search packages. Supports npm, PyPI, Go, Maven, and more.",
  },
  {
    number: "02",
    title: "Monitor",
    description: "We crawl 100+ sources continuously. New threats are classified in under 30 seconds.",
  },
  {
    number: "03",
    title: "Get alerted",
    description: "Instant notifications via Slack, email, or PagerDuty with severity and remediation steps.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-24 md:py-32 border-t border-border/30">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <motion.div
          className="mx-auto max-w-lg text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/40">
            How it works
          </p>
          <h2 className="font-serif text-[1.5rem] sm:text-[2rem] font-[400] tracking-[-0.02em] md:text-[2.75rem]">
            Three steps to peace of mind
          </h2>
        </motion.div>

        <div className="relative grid gap-8 sm:gap-0 md:grid-cols-3">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-[28px] left-[16.67%] right-[16.67%] h-px bg-border/25" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative text-center px-4 sm:px-8 md:py-0"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
            >
              <div className="relative mx-auto mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl border border-border/40 bg-card">
                <span className="text-[16px] sm:text-[18px] font-semibold tracking-[-0.02em] text-foreground/60 tabular-nums">
                  {step.number}
                </span>
              </div>

              <h3 className="text-[14px] sm:text-[15px] font-semibold tracking-[-0.01em]">{step.title}</h3>
              <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] text-muted-foreground/45 leading-relaxed max-w-[240px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
