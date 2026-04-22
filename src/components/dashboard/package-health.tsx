"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const packages = [
  { name: "react", version: "18.2.0", score: 98 },
  { name: "next", version: "14.1.0", score: 42 },
  { name: "lodash", version: "4.17.19", score: 15 },
  { name: "axios", version: "1.6.2", score: 38 },
  { name: "express", version: "4.18.2", score: 95 },
  { name: "prisma", version: "5.8.0", score: 92 },
];

function getScoreColor(score: number): string {
  if (score >= 80) return "oklch(0.72 0.12 175)";
  if (score >= 50) return "var(--severity-medium)";
  return "var(--severity-critical)";
}

export function PackageHealth() {
  const [animated, setAnimated] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="space-y-1" onMouseLeave={() => setHoveredIdx(null)}>
      {packages.map((pkg, i) => {
        const color = getScoreColor(pkg.score);
        const isHovered = hoveredIdx === i;

        return (
          <div
            key={pkg.name}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 -mx-3 transition-colors duration-100 cursor-default",
              isHovered && "bg-foreground/[0.03]"
            )}
            onMouseEnter={() => setHoveredIdx(i)}
          >
            <div className="w-[80px] min-w-0">
              <code className={cn(
                "text-[12px] font-mono font-medium block truncate transition-colors",
                isHovered ? "text-foreground" : "text-foreground/60"
              )}>
                {pkg.name}
              </code>
              <span className="text-[10px] text-muted-foreground/30 font-mono">
                {pkg.version}
              </span>
            </div>

            <div className="flex-1 h-[3px] rounded-full bg-foreground/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full transition-all ease-out"
                style={{
                  width: animated ? `${pkg.score}%` : "0%",
                  backgroundColor: color,
                  opacity: isHovered ? 0.9 : 0.5,
                  transitionDuration: animated ? "120ms" : "600ms",
                  transitionDelay: animated ? "0ms" : `${i * 60}ms`,
                }}
              />
            </div>

            <span
              className="w-[28px] text-right text-[11px] font-mono font-semibold tabular-nums"
              style={{ color }}
            >
              {pkg.score}
            </span>
          </div>
        );
      })}
    </div>
  );
}
