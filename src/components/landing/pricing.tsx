"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "For individual developers.",
    cta: "Get Started",
    features: [
      "10 packages",
      "Daily digest emails",
      "Public breach feed",
      "Severity filtering",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For developers who ship to production.",
    cta: "Start Free Trial",
    highlighted: true,
    features: [
      "100 packages",
      "Real-time alerts",
      "Slack & email integrations",
      "Upload package.json",
      "Alert history & search",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    description: "For teams with multiple projects.",
    cta: "Start Free Trial",
    features: [
      "Unlimited packages",
      "All integrations",
      "PagerDuty & Telegram",
      "Team members & roles",
      "Export & API access",
      "Custom alert rules",
      "Dedicated support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-14 sm:py-28 md:py-36 border-t border-border">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-md text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Pricing
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Start free, scale when ready
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            No credit card required. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 md:items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl",
                plan.highlighted
                  ? "border-2 border-foreground/15 bg-card card-elevated p-8 sm:p-10 md:py-12"
                  : "border border-border p-7 sm:p-9",
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                  <span className="rounded-full bg-foreground px-4 py-1 text-[11px] font-semibold text-background tracking-wide">
                    Most popular
                  </span>
                </div>
              )}

              <h3 className={cn("font-semibold", plan.highlighted ? "text-lg" : "text-base")}>{plan.name}</h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-8 flex items-baseline gap-1">
                <span className={cn("font-bold tracking-tight tabular-nums", plan.highlighted ? "text-5xl" : "text-4xl")}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-base text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>

              <Link
                href="/auth/signup"
                className={cn(
                  "group mt-8 flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all",
                  plan.highlighted
                    ? "bg-foreground text-background hover:opacity-90 py-3"
                    : "border border-border text-foreground hover:bg-muted py-2.5"
                )}
              >
                {plan.cta}
                <ArrowRight className="h-3.5 w-3.5 opacity-30 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <div className={cn("h-px bg-border", plan.highlighted ? "my-8" : "my-7")} />

              <ul className="flex-1 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check
                      className={cn("h-4 w-4 shrink-0", plan.highlighted ? "text-foreground" : "text-muted-foreground/60")}
                      strokeWidth={2}
                    />
                    <span className={cn(plan.highlighted ? "text-sm text-foreground/80" : "text-[13px] text-muted-foreground")}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
