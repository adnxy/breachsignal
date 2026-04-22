import { cn } from "@/lib/utils";

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Green rounded-square background */}
      <rect width="32" height="32" rx="8" fill="var(--brand, oklch(0.56 0.09 163))" />

      {/* Beetle icon — simplified, iconic silhouette in white */}
      <g transform="translate(6, 5) scale(0.625)" fill="white">
        {/* Antennae */}
        <path d="M13 5C12 3 10.5 2 9.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M19 5C20 3 21.5 2 22.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Head */}
        <ellipse cx="16" cy="7" rx="4.5" ry="3.5" />

        {/* Legs — left */}
        <path d="M8 12L4 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M7 18L3 18" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M8 24L4 27" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Legs — right */}
        <path d="M24 12L28 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M25 18L29 18" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M24 24L28 27" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Body — rounded shell */}
        <path d="M8 11C8 11 7 14 7 19C7 24 10 28 16 28C22 28 25 24 25 19C25 14 24 11 24 11H8Z" />

        {/* Center line */}
        <line x1="16" y1="11" x2="16" y2="28" stroke="var(--brand, oklch(0.56 0.09 163))" strokeWidth="2" />

        {/* Wing detail lines — left */}
        <line x1="11" y1="14" x2="11" y2="24" stroke="var(--brand, oklch(0.56 0.09 163))" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13.5" y1="13" x2="13.5" y2="26" stroke="var(--brand, oklch(0.56 0.09 163))" strokeWidth="1.5" strokeLinecap="round" />

        {/* Wing detail lines — right */}
        <line x1="21" y1="14" x2="21" y2="24" stroke="var(--brand, oklch(0.56 0.09 163))" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18.5" y1="13" x2="18.5" y2="26" stroke="var(--brand, oklch(0.56 0.09 163))" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Logo({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {!iconOnly && (
        <span className="text-[15px] font-[650] tracking-[-0.03em]">
          Breach<span className="text-[var(--brand)] font-[500]">Signal</span>
        </span>
      )}
    </div>
  );
}
