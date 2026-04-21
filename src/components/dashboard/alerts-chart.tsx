"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const defaultData = [
  { day: "Mon", total: 10 },
  { day: "Tue", total: 11 },
  { day: "Wed", total: 12 },
  { day: "Thu", total: 9 },
  { day: "Fri", total: 14 },
  { day: "Sat", total: 5 },
  { day: "Sun", total: 7 },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface AlertsChartProps {
  data?: { date: string; count: number }[];
}

export function AlertsChart({ data }: AlertsChartProps) {
  const [animated, setAnimated] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const chartData = data
    ? data.map((d) => ({
        day: DAYS[new Date(d.date).getDay()],
        total: d.count,
      }))
    : defaultData;

  const max = Math.max(...chartData.map((d) => d.total), 1);
  const total = chartData.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="space-y-3">
      {/* Summary line */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[24px] font-bold tracking-[-0.04em] tabular-nums">{total}</span>
        <span className="text-[11px] text-muted-foreground font-medium">alerts this week</span>
      </div>

      {/* Chart */}
      <div
        className="flex items-end gap-[6px] h-[120px]"
        onMouseLeave={() => setHovered(null)}
      >
        {chartData.map((d, i) => {
          const heightPct = (d.total / max) * 100;
          const isHovered = hovered === i;
          const isHighest = d.total === max;
          const isToday = i === chartData.length - 1;

          return (
            <div
              key={i}
              className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-default"
              onMouseEnter={() => setHovered(i)}
            >
              {/* Tooltip */}
              <div className={cn(
                "absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-[10px] font-semibold tabular-nums whitespace-nowrap transition-all duration-150 pointer-events-none z-10",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              )}>
                {d.total} alerts
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-foreground" />
              </div>

              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-[8px] transition-all duration-500 ease-out relative overflow-hidden",
                  isHovered
                    ? "bg-foreground shadow-[0_4px_12px_oklch(0_0_0/0.12)]"
                    : isHighest || isToday
                      ? "bg-foreground/90"
                      : "bg-foreground/[0.12]"
                )}
                style={{
                  height: animated ? `${Math.max(heightPct, 6)}%` : "0%",
                  transitionDelay: animated ? "0ms" : `${i * 60}ms`,
                  transitionDuration: animated ? "200ms" : "600ms",
                }}
              >
                {/* Shimmer on hover */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.08] to-white/[0.15] animate-[fadeIn_0.2s_ease]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-[6px]">
        {chartData.map((d, i) => {
          const isToday = i === chartData.length - 1;
          return (
            <div key={i} className="flex-1 text-center">
              <span className={cn(
                "text-[10px] font-medium transition-colors duration-150",
                hovered === i ? "text-foreground" : isToday ? "text-muted-foreground" : "text-muted-foreground/70"
              )}>
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
