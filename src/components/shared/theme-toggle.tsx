"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={cn("h-8 w-8 rounded-lg", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted/50",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={cn(
          "absolute h-[15px] w-[15px] transition-all duration-300",
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100 text-foreground/50"
        )}
        strokeWidth={1.8}
      />
      <Moon
        className={cn(
          "absolute h-[15px] w-[15px] transition-all duration-300",
          isDark
            ? "rotate-0 scale-100 opacity-100 text-foreground/50"
            : "-rotate-90 scale-0 opacity-0"
        )}
        strokeWidth={1.8}
      />
    </button>
  );
}
