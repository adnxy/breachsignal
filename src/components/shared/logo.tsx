import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-foreground shadow-sm">
        <Shield className="h-4 w-4 text-background" strokeWidth={2.5} />
      </div>
      {!iconOnly && (
        <span className="text-[15px] font-[650] tracking-[-0.03em]">
          Breach<span className="text-muted-foreground/60 font-[450]">Signal</span>
        </span>
      )}
    </div>
  );
}
