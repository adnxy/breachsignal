import { cn } from "@/lib/utils";

const statusStyles = {
  new:          "bg-[var(--severity-high-bg)] text-[var(--severity-high)] ring-[var(--severity-high-ring)]",
  acknowledged: "bg-[var(--severity-medium-bg)] text-[var(--severity-medium)] ring-[var(--severity-medium-ring)]",
  resolved:     "bg-[var(--success)]/8 text-[var(--success)] ring-[var(--success)]/12",
  ignored:      "bg-muted/60 text-muted-foreground/60 ring-border/40",
  safe:         "bg-[var(--success)]/8 text-[var(--success)] ring-[var(--success)]/12",
  vulnerable:   "bg-[var(--severity-critical-bg)] text-[var(--severity-critical)] ring-[var(--severity-critical-ring)]",
  unknown:      "bg-muted/60 text-muted-foreground/60 ring-border/40",
} as const;

export function StatusBadge({ status, className }: { status: keyof typeof statusStyles; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-[10px] font-semibold capitalize leading-none ring-1 ring-inset transition-colors duration-150",
      statusStyles[status],
      className,
    )}>
      <span className="h-[5px] w-[5px] rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
