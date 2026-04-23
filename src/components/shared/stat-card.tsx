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
        "group relative flex h-full flex-col rounded-xl border border-border p-5 transition-colors hover:bg-muted/30",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
      </div>

      <div className="flex flex-1 items-end justify-between">
        <div>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{displayValue}</p>
          {trend ? (
            <span className={cn(
              "inline-flex items-center gap-0.5 mt-2 text-xs tabular-nums",
              isUp ? "text-red-500" : "text-emerald-500"
            )}>
              {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trend.value)}%
              <span className="text-muted-foreground ml-0.5">{trend.label}</span>
            </span>
          ) : (
            <span className="inline-block mt-2 text-xs text-transparent select-none">&nbsp;</span>
          )}
        </div>
        {sparkData && (
          <div className="opacity-30 group-hover:opacity-60 transition-opacity">
            <Sparkline data={sparkData} color="stroke-foreground/40" fillColor="fill-foreground/[0.05]" height={32} width={64} />
          </div>
        )}
      </div>
    </div>
  );
}
