"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { Menu, X, ArrowRight, Shield } from "lucide-react";
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
      setScrolled(window.scrollY > 10);

      // Track active section
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

  // Lock body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="relative z-50 flex items-center justify-center gap-2 bg-foreground px-4 py-2 text-background">
        <Shield className="h-3 w-3 shrink-0 opacity-70" strokeWidth={2.5} />
        <p className="text-[11px] font-medium tracking-[-0.01em]">
          <span className="hidden sm:inline">Monitoring 12,847+ packages in real-time.</span>
          <span className="sm:hidden">12,847+ packages monitored.</span>
        </p>
        <Link
          href="/auth/signup"
          className="ml-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-background/80 underline decoration-background/30 underline-offset-2 transition-colors hover:text-background hover:decoration-background/60"
        >
          Start free <ArrowRight className="h-2.5 w-2.5" />
        </Link>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/80 glass shadow-[0_1px_3px_oklch(0_0_0/0.04),0_8px_24px_oklch(0_0_0/0.03)]"
            : "bg-background/0"
        )}
      >
        <div className="mx-auto flex h-[60px] max-w-[1080px] items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="relative z-10 transition-transform duration-150 active:scale-[0.97]">
            <Logo />
          </Link>

          {/* Center nav — pill-style with active indicator */}
          <nav className="absolute inset-x-0 mx-auto hidden w-fit items-center gap-0.5 rounded-full border border-border/50 bg-muted/30 p-1 md:flex glass-subtle">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-[6px] text-[13px] font-medium transition-all duration-200",
                  activeSection === link.href
                    ? "bg-background text-foreground shadow-[0_1px_3px_oklch(0_0_0/0.06),0_1px_1px_oklch(0_0_0/0.04)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right CTA group */}
          <div className="relative z-10 hidden items-center gap-1.5 md:flex">
            <Link
              href="/auth/signin"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-[13px] font-medium text-muted-foreground hover:text-foreground rounded-full px-4"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ size: "sm" }),
                "text-[13px] font-semibold rounded-full px-5 shadow-[0_1px_2px_oklch(0_0_0/0.1),0_2px_8px_oklch(0_0_0/0.08)] hover:shadow-[0_2px_4px_oklch(0_0_0/0.12),0_4px_16px_oklch(0_0_0/0.10)] transition-all duration-200 hover:-translate-y-px active:translate-y-0"
              )}
            >
              Get Started
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-muted/60 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative h-5 w-5">
              <Menu
                className={cn(
                  "absolute inset-0 h-5 w-5 transition-all duration-200",
                  mobileOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute inset-0 h-5 w-5 transition-all duration-200",
                  mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile nav — full-screen overlay */}
        <div
          className={cn(
            "fixed inset-x-0 top-[calc(60px+36px)] bottom-0 z-40 bg-background/95 glass transition-all duration-300 md:hidden",
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex h-full flex-col px-6 pt-6 pb-8">
            <div className="space-y-1">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-2xl px-4 py-3.5 text-[16px] font-medium transition-all duration-200",
                    activeSection === link.href
                      ? "bg-foreground text-background"
                      : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-auto space-y-3">
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full rounded-2xl text-[15px] font-semibold shadow-lg"
                )}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/auth/signin"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full rounded-2xl text-[15px] font-medium"
                )}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
