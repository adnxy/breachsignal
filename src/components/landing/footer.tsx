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
    <footer className="border-t border-border">
      {/* CTA band */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-5 px-6 py-12 text-center sm:text-left sm:flex-row sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Start monitoring your supply chain
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Free for up to 10 packages. No credit card required.
            </p>
          </div>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 shrink-0 w-full sm:w-auto justify-center"
          >
            Get Started Free
            <ArrowRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </div>
      </div>

      {/* Footer grid */}
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-[240px] text-sm text-muted-foreground">
              Real-time security intelligence for your software supply chain.
            </p>
            <div className="mt-5 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50 duration-[2000ms]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-500">All systems operational</span>
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {category}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {items.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-1 sm:flex-row sm:justify-between px-6 py-5">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BreachSignal
          </p>
          <p className="text-xs text-muted-foreground">
            Built for developers who ship securely.
          </p>
        </div>
      </div>
    </footer>
  );
}
