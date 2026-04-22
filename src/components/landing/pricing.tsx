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
    <section id="pricing" className="relative py-16 sm:py-28 md:py-36 border-t border-border/30">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
        <motion.div
          className="mx-auto max-w-md text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/40">
            Pricing
          </p>
          <h2 className="font-serif text-[1.5rem] sm:text-[2rem] font-[400] tracking-[-0.02em] text-foreground md:text-[2.5rem]">
            Start free, scale when ready
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl sm:rounded-3xl transition-all duration-300",
                plan.highlighted
                  ? "bg-foreground text-background p-7 sm:p-9 md:p-10 md:-my-3 shadow-[0_4px_24px_oklch(0_0_0/0.12),0_12px_48px_oklch(0_0_0/0.06)]"
                  : "border border-border/40 bg-card p-6 sm:p-8 md:p-9 hover:border-border/60"
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-3.5 py-1 text-[9px] font-bold text-white uppercase tracking-[0.08em] whitespace-nowrap shadow-sm">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="text-[14px] sm:text-[15px] font-semibold tracking-[-0.01em]">{plan.name}</h3>
                <p className={cn(
                  "mt-1 sm:mt-1.5 text-[11px] sm:text-[12px] leading-relaxed",
                  plan.highlighted ? "text-background/35" : "text-muted-foreground/40"
                )}>
                  {plan.description}
                </p>
              </div>

              <div className="mt-5 sm:mt-8 flex items-baseline gap-1">
                <span className="text-[36px] sm:text-[48px] font-bold tracking-[-0.05em] leading-none tabular-nums">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={cn(
                    "text-[13px] sm:text-[14px] font-medium",
                    plan.highlighted ? "text-background/20" : "text-muted-foreground/25"
                  )}>
                    {plan.period}
                  </span>
                )}
              </div>

              <Link
                href="/auth/signup"
                className={cn(
                  "mt-5 sm:mt-8 flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl py-2.5 sm:py-3 text-[13px] font-semibold transition-all duration-200",
                  plan.highlighted
                    ? "bg-background text-foreground hover:opacity-90 active:scale-[0.98]"
                    : "border border-border/40 text-foreground/60 hover:border-border hover:text-foreground active:scale-[0.98]"
                )}
              >
                {plan.cta}
                <ArrowRight className="h-3.5 w-3.5 opacity-40" />
              </Link>

              <div className={cn(
                "my-5 sm:my-8 h-px",
                plan.highlighted ? "bg-background/[0.08]" : "bg-border/25"
              )} />

              <ul className="flex-1 space-y-2.5 sm:space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 sm:gap-3">
                    <div className={cn(
                      "flex h-4 w-4 sm:h-[18px] sm:w-[18px] items-center justify-center rounded-full shrink-0",
                      plan.highlighted
                        ? "bg-[var(--brand-light)]/15"
                        : "bg-[var(--brand)]/[0.06]"
                    )}>
                      <Check
                        className={cn(
                          "h-2 w-2 sm:h-2.5 sm:w-2.5",
                          plan.highlighted ? "text-[var(--brand-light)]" : "text-[var(--brand)]/60"
                        )}
                        strokeWidth={3}
                      />
                    </div>
                    <span className={cn(
                      "text-[12px] sm:text-[13px]",
                      plan.highlighted ? "text-background/60" : "text-foreground/50"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 sm:mt-10 text-center text-[10px] sm:text-[11px] text-muted-foreground/25">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
