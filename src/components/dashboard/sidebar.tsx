"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Radio, Package, Bell, Plug, Settings, LogOut, ChevronsLeft, ArrowUpRight, Sparkles,
} from "lucide-react";
import { useState } from "react";

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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-background transition-[width] duration-200",
      collapsed ? "w-[60px]" : "w-[240px]"
    )}>
      {/* Header */}
      <div className={cn(
        "flex h-[56px] items-center border-b border-border",
        collapsed ? "justify-center px-0" : "justify-between px-5"
      )}>
        <Link href="/dashboard" className="flex items-center gap-0 transition-transform duration-150 active:scale-[0.97]">
          <Logo iconOnly={collapsed} />
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto", collapsed ? "px-2 pt-5" : "px-3 pt-5")}>
        {!collapsed && (
          <p className="mb-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Monitor
          </p>
        )}
        <div className="space-y-0.5">
          {primaryNav.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href} href={item.href}
                className={cn(
                  "group relative flex items-center rounded-xl transition-all duration-150",
                  collapsed ? "h-10 w-10 justify-center mx-auto" : "gap-3 px-3 py-[9px]",
                  isActive
                    ? "bg-foreground text-background shadow-[0_1px_3px_oklch(0_0_0/0.1),0_4px_12px_oklch(0_0_0/0.05)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("shrink-0", collapsed ? "h-[16px] w-[16px]" : "h-[15px] w-[15px]")} strokeWidth={isActive ? 2 : 1.7} />
                {!collapsed && (
                  <>
                    <span className="text-[13px] font-medium tracking-[-0.01em]">{item.label}</span>
                    {item.live && (
                      <span className="ml-auto relative flex h-[6px] w-[6px]">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/40 duration-[2000ms]" />
                        <span className={cn("relative inline-flex h-[6px] w-[6px] rounded-full", isActive ? "bg-background/70" : "bg-[var(--success)]")} />
                      </span>
                    )}
                    {item.badge && (
                      <span className={cn(
                        "ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                        isActive ? "bg-background/20 text-background" : "bg-[var(--severity-critical-bg)] text-[var(--severity-critical)]"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        <div className={cn("my-5", collapsed ? "px-1" : "px-3")}>
          <div className="h-px bg-border" />
        </div>

        {!collapsed && (
          <p className="mb-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Configure
          </p>
        )}
        <div className="space-y-0.5">
          {secondaryNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href} href={item.href}
                className={cn(
                  "group flex items-center rounded-xl transition-all duration-150",
                  collapsed ? "h-10 w-10 justify-center mx-auto" : "gap-3 px-3 py-[9px]",
                  isActive
                    ? "bg-foreground text-background shadow-[0_1px_3px_oklch(0_0_0/0.1),0_4px_12px_oklch(0_0_0/0.05)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("shrink-0", collapsed ? "h-[16px] w-[16px]" : "h-[15px] w-[15px]")} strokeWidth={isActive ? 2 : 1.7} />
                {!collapsed && <span className="text-[13px] font-medium tracking-[-0.01em]">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Upgrade card */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-transparent p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-foreground/[0.03] to-transparent rounded-full -mr-8 -mt-8" />
          <div className="flex items-center gap-2 mb-1.5 relative">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground/[0.08]">
              <Sparkles className="h-3 w-3 text-foreground/60" strokeWidth={2.2} />
            </div>
            <p className="text-[12px] font-semibold tracking-tight">Upgrade to Pro</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed relative">Unlimited packages & real-time alerts.</p>
          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-foreground px-3 py-[7px] text-[11px] font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98] shadow-sm relative">
            View Plans <ArrowUpRight className="h-3 w-3 opacity-70" />
          </button>
        </div>
      )}

      {/* User section */}
      <div className={cn("border-t border-border", collapsed ? "px-2 py-3" : "px-3 py-3")}>
        {collapsed ? (
          <button onClick={() => setCollapsed(false)} className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition-all mx-auto" aria-label="Expand sidebar">
            <ChevronsLeft className="h-3.5 w-3.5 rotate-180" />
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted transition-all cursor-pointer group">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-br from-foreground/10 to-foreground/[0.04] ring-1 ring-border text-[10px] font-bold text-foreground shadow-sm">JS</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[12px] font-semibold tracking-tight">Jane Smith</p>
              <p className="truncate text-[10px] text-muted-foreground">Individual Plan</p>
            </div>
            <LogOut className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" strokeWidth={1.6} />
          </div>
        )}
      </div>
    </aside>
  );
}
