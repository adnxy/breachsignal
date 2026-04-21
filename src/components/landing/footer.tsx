import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { Shield, ArrowUpRight, Globe, Rss } from "lucide-react";

const links = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Live Feed", href: "/dashboard/feed" },
    { label: "Changelog", href: "#" },
    { label: "API Docs", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#", badge: "Hiring" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "Status", href: "#", external: true },
  ],
};

const socials = [
  { label: "Blog", icon: Rss, href: "#" },
  { label: "Website", icon: Globe, href: "#" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      {/* CTA band */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-5 px-6 py-12 sm:flex-row sm:py-10">
          <div>
            <h3 className="text-[18px] font-semibold tracking-[-0.025em]">
              Start monitoring your supply chain
            </h3>
            <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
              Free for up to 10 packages. No credit card required.
            </p>
          </div>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[13px] font-semibold text-background shadow-[0_1px_2px_oklch(0_0_0/0.1),0_4px_12px_oklch(0_0_0/0.08)] transition-all duration-200 hover:shadow-[0_2px_4px_oklch(0_0_0/0.12),0_8px_24px_oklch(0_0_0/0.10)] hover:-translate-y-px active:translate-y-0 shrink-0"
          >
            Get Started Free
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-[1080px] px-6 py-14">
        <div className="grid gap-12 md:grid-cols-6">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-[260px] text-[13px] text-muted-foreground leading-[1.7]">
              Real-time security intelligence for your software supply chain. Know the moment your dependencies are at risk.
            </p>
            {/* Social links */}
            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground hover:border-border"
                  aria-label={social.label}
                >
                  <social.icon className="h-[15px] w-[15px]" strokeWidth={1.8} />
                </a>
              ))}
              <div className="ml-2 flex items-center gap-1.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20 px-3 py-1.5">
                <span className="relative flex h-[5px] w-[5px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/50 duration-[2000ms]" />
                  <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[var(--success)]" />
                </span>
                <span className="text-[10px] font-bold text-[var(--success)]">All systems operational</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="md:col-span-1">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                {category}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {items.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-[13px] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {"badge" in link && link.badge && (
                        <span className="rounded-full bg-[var(--accent-color-subtle)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--accent-color)]">
                          {link.badge}
                        </span>
                      )}
                      {"external" in link && link.external && (
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-px transition-all group-hover:opacity-60" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Security badge column */}
          <div className="md:col-span-1">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Security
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" strokeWidth={2} />
                <div>
                  <p className="text-[11px] font-semibold">SOC 2 Type II</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">Audited annually</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" strokeWidth={2} />
                <div>
                  <p className="text-[11px] font-semibold">GDPR Compliant</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">EU data protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} BreachSignal Inc. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground">
            Built with care for developers who ship securely.
          </p>
        </div>
      </div>
    </footer>
  );
}
