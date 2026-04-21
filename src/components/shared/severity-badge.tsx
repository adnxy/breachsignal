import { cn } from "@/lib/utils";
import type { Severity } from "@/types";

const config: Record<Severity, { label: string; class: string }> = {
  critical: {
    label: "Critical",
    class: "bg-[var(--severity-critical-bg)] text-[var(--severity-critical)] ring-[var(--severity-critical-ring)]",
  },
  high: {
    label: "High",
    class: "bg-[var(--severity-high-bg)] text-[var(--severity-high)] ring-[var(--severity-high-ring)]",
  },
  medium: {
    label: "Medium",
    class: "bg-[var(--severity-medium-bg)] text-[var(--severity-medium)] ring-[var(--severity-medium-ring)]",
  },
  low: {
    label: "Low",
    class: "bg-[var(--severity-low-bg)] text-[var(--severity-low)] ring-[var(--severity-low-ring)]",
  },
  info: {
    label: "Info",
    class: "bg-muted/60 text-muted-foreground/70 ring-border/50",
  },
};

export function SeverityBadge({ severity, className: extraClass }: { severity: Severity; className?: string }) {
  const c = config[severity];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[10px] font-semibold leading-none ring-1 ring-inset transition-colors duration-150",
      c.class,
      extraClass,
    )}>
      <span className="h-[5px] w-[5px] rounded-full bg-current opacity-80" />
      {c.label}
    </span>
  );
}
