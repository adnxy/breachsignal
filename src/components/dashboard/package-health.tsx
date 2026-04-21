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

function getScoreColor(score: number) {
  if (score >= 80) return { bar: "bg-[oklch(0.72_0.12_175)]", text: "text-[oklch(0.72_0.12_175)]", bg: "bg-[oklch(0.72_0.12_175_/_0.06)]" };
  if (score >= 50) return { bar: "bg-[var(--severity-medium)]", text: "text-[var(--severity-medium)]", bg: "bg-[var(--severity-medium-bg)]" };
  return { bar: "bg-[var(--severity-critical)]", text: "text-[var(--severity-critical)]", bg: "bg-[var(--severity-critical-bg)]" };
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
        const colors = getScoreColor(pkg.score);
        const isHovered = hoveredIdx === i;

        return (
          <div
            key={pkg.name}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 -mx-3 transition-all duration-200 cursor-default",
              isHovered ? "bg-muted/50" : "bg-transparent"
            )}
            onMouseEnter={() => setHoveredIdx(i)}
          >
            {/* Package name + version */}
            <div className="w-[90px] min-w-0">
              <code className={cn(
                "text-[12px] font-mono font-semibold transition-colors duration-150 block truncate",
                isHovered ? "text-foreground" : "text-foreground/80"
              )}>
                {pkg.name}
              </code>
              <span className={cn(
                "text-[10px] text-muted-foreground transition-opacity duration-150",
                isHovered ? "opacity-100" : "opacity-80"
              )}>
                {pkg.version}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex-1 h-[6px] rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all ease-out",
                  colors.bar,
                  isHovered ? "opacity-100" : "opacity-85"
                )}
                style={{
                  width: animated ? `${pkg.score}%` : "0%",
                  transitionDuration: animated ? "200ms" : "700ms",
                  transitionDelay: animated ? "0ms" : `${i * 70}ms`,
                }}
              />
            </div>

            {/* Score */}
            <div className={cn(
              "w-[36px] text-right text-[12px] font-mono font-bold tabular-nums transition-all duration-150",
              colors.text,
              isHovered ? "scale-110" : "scale-100"
            )}>
              {pkg.score}
            </div>
          </div>
        );
      })}
    </div>
  );
}
