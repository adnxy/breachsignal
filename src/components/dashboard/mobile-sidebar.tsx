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
  { href: "/dashboard/packages", icon: Package, label: "Packages" },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts", badge: 3 },
  { href: "/dashboard/integrations", icon: Plug, label: "Integrations" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[240px] p-0 border-r-0 shadow-xl">
        <div className="flex h-[56px] items-center px-5 border-b border-border/50">
          <Logo />
        </div>
        <nav className="space-y-0.5 px-3 pt-6">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-100",
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
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 p-3">
          <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground transition-colors">
            <LogOut className="h-[15px] w-[15px]" strokeWidth={1.6} />
            <span>Sign Out</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
