"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GitBranch } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-[340px]">
        <div className="mb-10 text-center">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-[20px] font-[620] tracking-[-0.03em]">Welcome back</h1>
          <p className="mt-1 text-[13px] text-muted-foreground/55">
            Sign in to your BreachSignal account
          </p>
        </div>

        <Button variant="outline" className="w-full h-10 text-[13px] shadow-sm" disabled>
          <GitBranch className="mr-2 h-3.5 w-3.5" />
          Continue with GitHub
        </Button>

        <div className="relative my-7">
          <Separator className="bg-border/30" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[10px] text-muted-foreground/30 uppercase tracking-wider font-semibold">
            or
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-[12px] text-[var(--severity-critical)] text-center">{error}</p>
          )}
          <div>
            <Label htmlFor="email" className="text-[12px] font-[550]">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              className="mt-1.5 h-10 text-[13px] shadow-sm"
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[12px] font-[550]">Password</Label>
              <a href="#" className="text-[11px] text-muted-foreground/40 hover:text-foreground transition-colors">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              className="mt-1.5 h-10 text-[13px] shadow-sm"
              required
            />
          </div>
          <Button type="submit" className="w-full h-10 text-[13px] font-[550] shadow-md shadow-primary/10" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-8 text-center text-[12px] text-muted-foreground/40">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-[550] text-foreground/80 hover:text-foreground transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
