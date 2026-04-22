import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const links = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Live Feed", href: "/dashboard/feed" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/30">
      {/* CTA band */}
      <div className="border-b border-border/20">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-5 px-5 sm:px-6 py-10 sm:py-12 text-center sm:text-left sm:flex-row sm:justify-between">
          <div>
            <h3 className="text-[16px] sm:text-[18px] font-semibold tracking-[-0.02em]">
              Start monitoring your supply chain
            </h3>
            <p className="mt-1 sm:mt-1.5 text-[12px] sm:text-[13px] text-muted-foreground/40">
              Free for up to 10 packages. No credit card required.
            </p>
          </div>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[13px] font-semibold text-background transition-all duration-200 hover:opacity-90 active:scale-[0.98] shrink-0 w-full sm:w-auto justify-center"
          >
            Get Started Free
            <ArrowRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Footer grid */}
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-3 sm:mt-4 max-w-[240px] text-[11px] sm:text-[12px] text-muted-foreground/40 leading-relaxed">
              Real-time security intelligence for your software supply chain.
            </p>
            <div className="mt-4 sm:mt-5 flex items-center gap-1.5">
              <span className="relative flex h-[5px] w-[5px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/50 duration-[2000ms]" />
                <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[var(--success)]" />
              </span>
              <span className="text-[10px] font-semibold text-[var(--success)]/70">All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/30">
                {category}
              </h4>
              <ul className="mt-3 sm:mt-3.5 space-y-2">
                {items.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[11px] sm:text-[12px] text-foreground/40 transition-colors hover:text-foreground/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/20">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-1 sm:flex-row sm:justify-between px-5 sm:px-6 py-4 sm:py-5">
          <p className="text-[10px] text-muted-foreground/25">
            &copy; {new Date().getFullYear()} BreachSignal
          </p>
          <p className="text-[10px] text-muted-foreground/25">
            Built for developers who ship securely.
          </p>
        </div>
      </div>
    </footer>
  );
}
