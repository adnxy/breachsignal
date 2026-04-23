"use client";

import { motion } from "framer-motion";
import { GitBranch, Scan, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    number: "01",
    icon: GitBranch,
    title: "Connect your repos",
    description: "Sign in with GitHub and select repositories. We read your dependency manifests — no code access needed.",
  },
  {
    number: "02",
    icon: Scan,
    title: "Automatic scanning",
    description: "Every dependency is checked against 100+ vulnerability databases, threat feeds, and malware scanners.",
  },
  {
    number: "03",
    icon: Bell,
    title: "Instant alerts",
    description: "Get notified via Slack, email, or PagerDuty the moment a vulnerability affects your stack.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 md:py-36 border-t border-border">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div
          className="mx-auto max-w-lg text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps to peace of mind
          </h2>
        </motion.div>

        <div className="relative grid gap-8 sm:gap-0 md:grid-cols-3">
          <div className="hidden md:block absolute top-7 left-[16.67%] right-[16.67%] h-px bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative text-center px-8"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
            >
              <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-background">
                <step.icon className="h-5 w-5 text-foreground" strokeWidth={1.7} />
              </div>

              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
        >
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <GitBranch className="h-3.5 w-3.5" />
            Connect GitHub — it takes 30 seconds
            <ArrowRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
