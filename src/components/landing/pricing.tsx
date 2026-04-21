"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1080px] px-6">
        <motion.div
          className="mx-auto max-w-md text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-serif text-[2rem] font-[400] tracking-[-0.02em] md:text-[2.5rem]">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
            Start free. Upgrade when you need real-time protection.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-7",
                plan.highlighted
                  ? "border-foreground/20 bg-foreground text-background shadow-xl"
                  : "border-border bg-card shadow-sm"
              )}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-background px-3 py-1 text-[10px] font-bold text-foreground uppercase tracking-wider shadow-sm">
                  Popular
                </span>
              )}

              <h3 className="text-[15px] font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[36px] font-bold tracking-[-0.04em] leading-none tabular-nums">${plan.price}</span>
                {plan.price > 0 && (
                  <span className={cn("text-[13px] font-medium", plan.highlighted ? "text-background/60" : "text-muted-foreground")}>/mo</span>
                )}
              </div>
              <p className={cn("mt-2 text-[13px] leading-relaxed", plan.highlighted ? "text-background/70" : "text-muted-foreground")}>
                {plan.description}
              </p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", plan.highlighted ? "text-background/60" : "text-foreground/50")} strokeWidth={2.5} />
                    <span className={cn("text-[13px] leading-snug", plan.highlighted ? "text-background/85" : "text-foreground/80")}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className={cn(
                  "mt-7 h-10 text-[13px] font-semibold rounded-xl",
                  plan.highlighted
                    ? buttonVariants({ variant: "default" }) + " bg-background text-foreground hover:bg-background/90"
                    : buttonVariants({ variant: "outline" })
                )}
              >
                {plan.price === 0 ? "Get Started" : "Start Free Trial"}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
