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
    <div className="space-y-4">
      <div className="flex items-baseline gap-2">
        <span className="text-[24px] font-semibold tracking-[-0.03em] tabular-nums leading-none">{total}</span>
        <span className="text-[11px] text-muted-foreground/40">this week</span>
      </div>

      <div
        className="flex items-end gap-1.5 h-[100px]"
        onMouseLeave={() => setHovered(null)}
      >
        {chartData.map((d, i) => {
          const heightPct = (d.total / max) * 100;
          const isHovered = hovered === i;

          return (
            <div
              key={i}
              className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-default"
              onMouseEnter={() => setHovered(i)}
            >
              {/* Tooltip */}
              <div className={cn(
                "absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-foreground text-background text-[10px] font-medium tabular-nums whitespace-nowrap transition-all duration-100 pointer-events-none z-10",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              )}>
                {d.total}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-foreground" />
              </div>

              <div
                className={cn(
                  "w-full rounded transition-all ease-out",
                  isHovered ? "bg-foreground" : "bg-foreground/[0.07]"
                )}
                style={{
                  height: animated ? `${Math.max(heightPct, 3)}%` : "0%",
                  transitionDuration: animated ? "120ms" : "500ms",
                  transitionDelay: animated ? "0ms" : `${i * 50}ms`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-1.5">
        {chartData.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span className={cn(
              "text-[10px] transition-colors duration-100",
              hovered === i ? "text-foreground font-medium" : "text-muted-foreground/30"
            )}>
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
