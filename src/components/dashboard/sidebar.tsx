"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Radio, Package, Bell, Plug, Settings, LogOut, GitBranch, ChevronRight,
} from "lucide-react";

const primaryNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/feed", icon: Radio, label: "Live Feed", live: true },
  { href: "/dashboard/packages", icon: Package, label: "Packages" },
  { href: "/dashboard/repositories", icon: GitBranch, label: "Repositories" },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts", badge: 3 },
];

const secondaryNav = [
  { href: "/dashboard/integrations", icon: Plug, label: "Integrations" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-5 border-b border-border">
        <Link href="/dashboard">
          <Logo />
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pt-4">
        <div className="space-y-0.5">
          {primaryNav.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                <span>{item.label}</span>
                {item.live && (
                  <span className="ml-auto relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40 duration-[2500ms]" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                )}
                {item.badge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium tabular-nums bg-red-500/10 text-red-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="my-3 h-px bg-border mx-3" />

        <div className="space-y-0.5">
          {secondaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
                  isActive
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted transition-colors cursor-pointer group">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-medium ring-1 ring-border">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[13px] font-medium">Jane Smith</p>
            <p className="truncate text-[11px] text-muted-foreground">Pro Plan</p>
          </div>
          <LogOut className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
        </div>
      </div>
    </aside>
  );
}
