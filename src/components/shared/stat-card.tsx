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

  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += value / 20;
      if (current >= value) { setDisplayValue(value); clearInterval(timer); }
      else setDisplayValue(Math.floor(current));
    }, 18);
    return () => clearInterval(timer);
  }, [value]);

  const isUp = trend && trend.value > 0;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-xl border border-border/50 bg-card p-5 cursor-default transition-colors duration-150 hover:border-border/80",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-[0.08em]">{title}</p>
        <Icon className="h-[14px] w-[14px] text-muted-foreground/30" strokeWidth={1.5} />
      </div>

      <div className="flex flex-1 items-end justify-between">
        <div>
          <p className="text-[28px] font-semibold tracking-[-0.04em] leading-none tabular-nums">{displayValue}</p>
          {trend ? (
            <span className={cn(
              "inline-flex items-center gap-0.5 mt-2.5 text-[11px] font-medium tabular-nums",
              isUp
                ? "text-[var(--severity-critical)]"
                : "text-[var(--success)]"
            )}>
              {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trend.value)}%
              <span className="text-muted-foreground/35 ml-0.5">{trend.label}</span>
            </span>
          ) : (
            <span className="inline-block mt-2.5 text-[11px] text-transparent select-none">&nbsp;</span>
          )}
        </div>
        {sparkData && (
          <div className="opacity-40 group-hover:opacity-70 transition-opacity">
            <Sparkline data={sparkData} color="stroke-foreground/20" fillColor="fill-foreground/[0.03]" height={32} width={64} />
          </div>
        )}
      </div>
    </div>
  );
}
