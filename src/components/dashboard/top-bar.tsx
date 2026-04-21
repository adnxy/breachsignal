"use client";

import { Bell, Search, Menu, Command, ChevronRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const breadcrumbLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/feed": "Live Feed",
  "/dashboard/packages": "Packages",
  "/dashboard/alerts": "Alerts",
  "/dashboard/integrations": "Integrations",
  "/dashboard/settings": "Settings",
};

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const pageLabel = breadcrumbLabels[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 glass">
      <div className="flex h-[56px] items-center gap-3 px-4 lg:px-6">
        {/* Mobile menu */}
        <button
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted transition-all"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.7} />
        </button>

        {/* Breadcrumb */}
        <div className="hidden lg:flex items-center gap-1.5 text-[13px] min-w-0">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium shrink-0">
            Dashboard
          </Link>
          {pageLabel !== "Overview" && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground font-semibold tracking-[-0.01em] truncate">{pageLabel}</span>
            </>
          )}
        </div>

        {/* Mobile page title */}
        <p className="text-[14px] font-semibold tracking-[-0.01em] lg:hidden">{pageLabel}</p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <button className="group relative flex h-9 items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3.5 transition-all duration-200 hover:bg-muted hover:border-border hover:shadow-sm w-full max-w-[280px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20">
          <Search className="h-[14px] w-[14px] text-muted-foreground group-hover:text-foreground/70 transition-colors shrink-0" strokeWidth={2} />
          <span className="text-[12px] text-muted-foreground group-hover:text-foreground/60 flex-1 text-left transition-colors tracking-[-0.01em] hidden sm:block">Search...</span>
          <kbd className="hidden sm:inline-flex h-[20px] items-center gap-[3px] rounded-[5px] border border-border bg-background px-1.5 text-[9px] font-mono text-muted-foreground shadow-[0_1px_0_oklch(0_0_0/0.03)]">
            <Command className="h-[9px] w-[9px]" />K
          </kbd>
        </button>

        {/* Separator */}
        <div className="hidden md:block h-5 w-px bg-border mx-0.5" />

        {/* Live monitoring badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-[5px] rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20">
          <span className="relative flex h-[6px] w-[6px]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/50 duration-[2000ms]" />
            <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[var(--success)]" />
          </span>
          <span className="text-[10px] font-bold text-[var(--success)] tracking-[-0.01em]">Live</span>
        </div>

        {/* Notifications */}
        <Link
          href="/dashboard/alerts"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Bell className="h-[16px] w-[16px]" strokeWidth={1.7} />
          <span className="absolute right-[7px] top-[7px] flex h-[7px] w-[7px]">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--severity-critical)]/40 animate-ping duration-[2500ms]" />
            <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[var(--severity-critical)] ring-[1.5px] ring-background" />
          </span>
        </Link>

        {/* Upgrade pill */}
        <Link
          href="/dashboard/settings"
          className="hidden lg:flex items-center gap-1.5 rounded-full border border-border bg-gradient-to-r from-muted/50 to-muted/20 px-3 py-[5px] transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
        >
          <Sparkles className="h-3 w-3 text-foreground/50" strokeWidth={2} />
          <span className="text-[10px] font-bold text-foreground/60">Upgrade</span>
        </Link>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20">
            <Avatar className="h-[28px] w-[28px] ring-1 ring-border shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-foreground/10 to-foreground/[0.04] text-foreground text-[9px] font-bold tracking-tight">
                JS
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px] rounded-xl p-1.5 premium-shadow-lg border-border">
            <div className="px-3 py-2.5">
              <p className="text-[13px] font-semibold tracking-tight">Jane Smith</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">jane@company.com</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Individual</span>
              </div>
            </div>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="rounded-lg py-2 px-3 cursor-pointer">
              <Link href="/dashboard/settings" className="w-full text-[12px] font-medium">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-2 px-3 cursor-pointer">
              <Link href="/dashboard/integrations" className="w-full text-[12px] font-medium">Integrations</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-2 px-3 cursor-pointer">
              <Link href="#" className="w-full text-[12px] font-medium">Help & Support</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="rounded-lg py-2 px-3 text-[var(--severity-critical)] text-[12px] font-medium cursor-pointer">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
