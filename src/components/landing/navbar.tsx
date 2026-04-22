"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const sections = navLinks.map((l) => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(`#${id}`);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-[0_1px_2px_oklch(0_0_0/0.02)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[56px] max-w-[1080px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="relative z-10 transition-transform duration-150 active:scale-[0.97]">
          <Logo />
        </Link>

        {/* Center nav */}
        <nav className="absolute inset-x-0 mx-auto hidden w-fit items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-4 py-[6px] text-[13px] font-medium transition-all duration-200",
                activeSection === link.href
                  ? "text-foreground"
                  : "text-muted-foreground/60 hover:text-foreground"
              )}
            >
              {link.label}
              {/* Active underline dot */}
              {activeSection === link.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-foreground" />
              )}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="relative z-10 hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <Link
            href="/auth/signin"
            className="rounded-full px-4 py-[6px] text-[13px] font-medium text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-[7px] text-[13px] font-semibold text-background transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile right */}
        <div className="relative z-10 flex items-center gap-1 md:hidden">
          <ThemeToggle />
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted/40"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative h-5 w-5">
            <Menu
              className={cn(
                "absolute inset-0 h-5 w-5 transition-all duration-200",
                mobileOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
              )}
              strokeWidth={1.6}
            />
            <X
              className={cn(
                "absolute inset-0 h-5 w-5 transition-all duration-200",
                mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
              )}
              strokeWidth={1.6}
            />
          </div>
        </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          "fixed inset-x-0 top-[56px] bottom-0 z-40 bg-background transition-all duration-300 md:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-full flex-col px-6 pt-8 pb-8">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3.5 text-[16px] font-medium transition-colors",
                  activeSection === link.href
                    ? "text-foreground bg-foreground/[0.04]"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02]"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-auto space-y-3">
            <Link
              href="/auth/signup"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-[15px] font-semibold text-background transition-opacity hover:opacity-90"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/signin"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center rounded-xl border border-border/60 px-6 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/[0.03]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
