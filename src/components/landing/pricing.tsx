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
    description: "For individual developers getting started.",
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
    name: "Individual",
    price: "$19",
    period: "/mo",
    description: "For developers who ship to production.",
    cta: "Start Free Trial",
    highlighted: true,
    features: [
      "100 packages",
      "Real-time alerts",
      "Slack & email",
      "Upload package.json",
      "Alert history & search",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    description: "For teams monitoring multiple projects.",
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
    <section id="pricing" className="relative py-20 sm:py-28 md:py-36 border-t border-border">
      <div className="mx-auto max-w-[1000px] px-6">
        <motion.div
          className="mx-auto max-w-md text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-4 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start free, scale when ready
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl transition-all",
                plan.highlighted
                  ? "bg-foreground text-background p-8 md:p-10 md:-my-4 shadow-2xl"
                  : "border border-border p-8 md:p-9"
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3.5 py-1 text-[10px] font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="text-sm font-semibold">{plan.name}</h3>
                <p className={cn(
                  "mt-1.5 text-xs",
                  plan.highlighted ? "text-background/50" : "text-muted-foreground"
                )}>
                  {plan.description}
                </p>
              </div>

              <div className="mt-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight tabular-nums">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={cn(
                    "text-sm",
                    plan.highlighted ? "text-background/30" : "text-muted-foreground"
                  )}>
                    {plan.period}
                  </span>
                )}
              </div>

              <Link
                href="/auth/signup"
                className={cn(
                  "mt-8 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                  plan.highlighted
                    ? "bg-background text-foreground hover:opacity-90"
                    : "border border-border text-foreground hover:bg-muted"
                )}
              >
                {plan.cta}
                <ArrowRight className="h-3.5 w-3.5 opacity-40" />
              </Link>

              <div className={cn(
                "my-8 h-px",
                plan.highlighted ? "bg-background/10" : "bg-border"
              )} />

              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        plan.highlighted ? "text-emerald-400" : "text-muted-foreground"
                      )}
                      strokeWidth={2}
                    />
                    <span className={cn(
                      "text-sm",
                      plan.highlighted ? "text-background/70" : "text-muted-foreground"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
