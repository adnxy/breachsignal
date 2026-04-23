import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { Features } from "@/components/landing/features";
import { Sources } from "@/components/landing/sources";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BreachSignal — Know the moment your stack is at risk",
  description:
    "Real-time alerts for dependencies, package compromises, CVEs, and supply-chain and security incidents. Monitor your software supply chain in one place.",
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <Sources />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
