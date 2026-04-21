"use client";

import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  color = "stroke-foreground/20",
  fillColor = "fill-foreground/[0.03]",
  height = 32,
  width = 80,
  className,
}: {
  data: number[];
  color?: string;
  fillColor?: string;
  height?: number;
  width?: number;
  className?: string;
}) {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
    >
      <path d={areaPath} className={fillColor} />
      <path d={linePath} fill="none" className={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={2}
        className={color.replace("stroke-", "fill-")}
      />
    </svg>
  );
}
