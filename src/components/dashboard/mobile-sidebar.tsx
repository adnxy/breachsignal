"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Radio, Package, Bell, Plug, Settings, LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/feed", icon: Radio, label: "Live Feed", live: true },
  { href: "/dashboard/packages", icon: Package, label: "My Packages" },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts", badge: 3 },
  { href: "/dashboard/integrations", icon: Plug, label: "Integrations" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[260px] p-0 border-r-0 premium-shadow-lg">
        <div className="flex h-[56px] items-center px-5 border-b border-border">
          <Logo />
        </div>
        <nav className="space-y-0.5 px-3 pt-5">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-[15px] w-[15px] shrink-0" strokeWidth={isActive ? 2 : 1.7} />
                <span className="tracking-[-0.01em]">{item.label}</span>
                {item.live && (
                  <span className="ml-auto relative flex h-[6px] w-[6px]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/50" />
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
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <LogOut className="h-[15px] w-[15px]" strokeWidth={1.7} />
            <span>Sign Out</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
