"use client";

import { Bell, Search, Menu, Command, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
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
    <header className="sticky top-0 z-20 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="flex h-[48px] items-center gap-4 px-5 lg:px-10">
        {/* Mobile menu */}
        <button
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-foreground/[0.04] transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4 text-foreground/50" strokeWidth={1.6} />
        </button>

        {/* Breadcrumb */}
        <div className="hidden lg:flex items-center gap-1.5 text-[13px]">
          <Link href="/dashboard" className="text-muted-foreground/50 hover:text-foreground transition-colors">
            Dashboard
          </Link>
          {pageLabel !== "Overview" && (
            <>
              <ChevronRight className="h-3 w-3 text-border" />
              <span className="text-foreground font-medium">{pageLabel}</span>
            </>
          )}
        </div>

        {/* Mobile page title */}
        <p className="text-[14px] font-medium lg:hidden">{pageLabel}</p>

        <div className="flex-1" />

        {/* Search */}
        <button className="group flex h-8 items-center gap-2 rounded-lg border border-border/50 px-3 transition-colors hover:border-border w-full max-w-[220px]">
          <Search className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors shrink-0" strokeWidth={1.8} />
          <span className="text-[12px] text-muted-foreground/35 flex-1 text-left hidden sm:block">Search...</span>
          <kbd className="hidden sm:inline-flex h-[18px] items-center gap-[2px] rounded border border-border/50 bg-foreground/[0.02] px-1.5 text-[9px] font-mono text-muted-foreground/35">
            <Command className="h-2 w-2" />K
          </kbd>
        </button>

        <ThemeToggle />

        {/* Notifications */}
        <Link
          href="/dashboard/alerts"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "relative h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-foreground/[0.04]"
          )}
        >
          <Bell className="h-[15px] w-[15px]" strokeWidth={1.6} />
          <span className="absolute right-1.5 top-1.5 h-[5px] w-[5px] rounded-full bg-[var(--severity-critical)] ring-[1.5px] ring-background" />
        </Link>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-foreground/[0.04] transition-colors focus-visible:outline-none">
            <Avatar className="h-[26px] w-[26px]">
              <AvatarFallback className="bg-foreground/[0.06] text-foreground/50 text-[9px] font-semibold">
                JS
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] rounded-xl p-1.5 border-border/50 shadow-lg">
            <div className="px-2.5 py-2">
              <p className="text-[12px] font-medium">Jane Smith</p>
              <p className="text-[11px] text-muted-foreground/50 mt-0.5">jane@company.com</p>
            </div>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem className="rounded-lg py-1.5 px-2.5 cursor-pointer text-[12px]">
              <Link href="/dashboard/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-1.5 px-2.5 cursor-pointer text-[12px]">
              <Link href="/dashboard/integrations" className="w-full">Integrations</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem className="rounded-lg py-1.5 px-2.5 text-[var(--severity-critical)] text-[12px] cursor-pointer">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
