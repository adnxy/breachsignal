"use client";

import { Bell, Search, Menu, Command, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ProjectSwitcher } from "@/components/dashboard/project-switcher";
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
  "/dashboard/repositories": "Repositories",
  "/dashboard/alerts": "Alerts",
  "/dashboard/integrations": "Integrations",
  "/dashboard/settings": "Settings",
};

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const pageLabel = breadcrumbLabels[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu */}
        <button
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        </button>

        {/* Project Switcher + Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2">
          <ProjectSwitcher />
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" strokeWidth={1.5} />
          <div className="flex items-center gap-1.5 text-sm">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            {pageLabel !== "Overview" && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                <span className="text-foreground font-medium">{pageLabel}</span>
              </>
            )}
          </div>
        </div>

        {/* Mobile breadcrumb */}
        <div className="flex items-center gap-2 lg:hidden">
          <ProjectSwitcher />
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" strokeWidth={1.5} />
          <p className="text-sm font-medium">{pageLabel}</p>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <button className="group flex h-8 items-center gap-2 rounded-lg border border-border px-3 transition-colors hover:bg-muted w-full max-w-[240px]">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.7} />
          <span className="text-sm text-muted-foreground flex-1 text-left hidden sm:block">Search...</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <ThemeToggle />

        {/* Notifications */}
        <Link
          href="/dashboard/alerts"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "relative h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-background" />
        </Link>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors focus-visible:outline-none">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-muted text-xs font-medium">
                JS
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] rounded-lg p-1.5 border-border">
            <div className="px-2.5 py-2">
              <p className="text-sm font-medium">Jane Smith</p>
              <p className="text-xs text-muted-foreground mt-0.5">jane@company.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-md cursor-pointer text-sm">
              <Link href="/dashboard/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-md cursor-pointer text-sm">
              <Link href="/dashboard/integrations" className="w-full">Integrations</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-md text-red-500 cursor-pointer text-sm">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
