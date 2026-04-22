"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Radio, Package, Bell, Plug, Settings, LogOut,
} from "lucide-react";

const primaryNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/feed", icon: Radio, label: "Live Feed", live: true },
  { href: "/dashboard/packages", icon: Package, label: "Packages" },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts", badge: 3 },
];

const secondaryNav = [
  { href: "/dashboard/integrations", icon: Plug, label: "Integrations" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[220px] flex-col border-r border-border/50 bg-background">
      {/* Header */}
      <div className="flex h-[56px] items-center px-5 border-b border-border/50">
        <Link href="/dashboard" className="transition-transform duration-150 active:scale-[0.97]">
          <Logo />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pt-6">
        <div className="space-y-0.5">
          {primaryNav.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-100",
                  isActive
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
                )}
              >
                <item.icon className="h-[15px] w-[15px] shrink-0" strokeWidth={isActive ? 1.9 : 1.6} />
                <span className="tracking-[-0.01em]">{item.label}</span>
                {item.live && (
                  <span className="ml-auto relative flex h-[5px] w-[5px]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/40 duration-[2500ms]" />
                    <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[var(--success)]" />
                  </span>
                )}
                {item.badge && (
                  <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums bg-[var(--severity-critical-bg)] text-[var(--severity-critical)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="my-5 h-px bg-border/40 mx-3" />

        <div className="space-y-0.5">
          {secondaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-100",
                  isActive
                    ? "bg-foreground/[0.06] text-foreground"
                    : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
                )}
              >
                <item.icon className="h-[15px] w-[15px] shrink-0" strokeWidth={isActive ? 1.9 : 1.6} />
                <span className="tracking-[-0.01em]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-border/50 px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-foreground/[0.03] transition-colors cursor-pointer group">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.06] text-[10px] font-semibold text-foreground/60">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[12px] font-medium text-foreground/80">Jane Smith</p>
            <p className="truncate text-[10px] text-muted-foreground/50">Individual</p>
          </div>
          <LogOut className="h-3.5 w-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
        </div>
      </div>
    </aside>
  );
}
