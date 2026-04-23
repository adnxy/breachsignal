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
    class: "bg-muted text-muted-foreground ring-border",
  },
};

export function SeverityBadge({ severity, className: extraClass }: { severity: Severity; className?: string }) {
  const c = config[severity];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-semibold leading-none ring-1 ring-inset",
      c.class,
      extraClass,
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}
