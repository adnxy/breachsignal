"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Sparkline } from "@/components/dashboard/sparkline";

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  sparkData,
  className,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  sparkData?: number[];
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += value / 25;
      if (current >= value) { setDisplayValue(value); clearInterval(timer); }
      else setDisplayValue(Math.floor(current));
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  const isUp = trend && trend.value > 0;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card p-5 overflow-hidden cursor-default transition-all duration-300 ease-out",
        hovered
          ? "border-border shadow-[0_1px_3px_oklch(0_0_0/0.05),0_8px_24px_oklch(0_0_0/0.07)] -translate-y-[2px]"
          : "border-border shadow-[0_0_0_1px_oklch(0_0_0/0.03),0_1px_2px_oklch(0_0_0/0.04)] translate-y-0",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl ring-1 transition-all duration-300",
          hovered
            ? "bg-foreground/[0.08] ring-foreground/10"
            : "bg-muted ring-border"
        )}>
          <Icon className={cn(
            "h-[15px] w-[15px] transition-colors duration-300",
            hovered ? "text-foreground/80" : "text-muted-foreground"
          )} strokeWidth={1.7} />
        </div>
        {sparkData && (
          <div className={cn("transition-opacity duration-300", hovered ? "opacity-100" : "opacity-70")}>
            <Sparkline data={sparkData} color="stroke-foreground/30" fillColor="fill-foreground/[0.06]" height={28} width={64} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[30px] font-bold tracking-[-0.045em] leading-none tabular-nums">{displayValue}</p>
          <p className="mt-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.04em]">{title}</p>
        </div>
        {trend && (
          <span className={cn(
            "inline-flex items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] font-semibold tabular-nums transition-all duration-300",
            isUp
              ? cn("bg-[var(--severity-critical-bg)] text-[var(--severity-critical)]", hovered && "bg-[var(--severity-critical-ring)]")
              : cn("bg-[var(--success)]/10 text-[var(--success)]", hovered && "bg-[var(--success)]/15")
          )}>
            {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
