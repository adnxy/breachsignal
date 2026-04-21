"use client";

import { motion } from "framer-motion";
import {
  Upload, Package, MessageSquare, Bell, Send, Mail, Radio, BarChart3,
} from "lucide-react";

const features = [
  { icon: Upload, title: "Upload package.json", description: "Drop your manifest and every dependency is tracked instantly." },
  { icon: Package, title: "Subscribe to packages", description: "Search and add individual packages to your monitoring watchlist." },
  { icon: MessageSquare, title: "Slack alerts", description: "Instant notifications delivered to your team's Slack channels." },
  { icon: Bell, title: "PagerDuty incidents", description: "Auto-trigger incidents for critical supply-chain security events." },
  { icon: Send, title: "Telegram notifications", description: "Push alerts directly to your Telegram chats and groups." },
  { icon: Mail, title: "Email digests", description: "Daily or weekly summaries delivered straight to your inbox." },
  { icon: Radio, title: "Live breach feed", description: "Real-time stream of advisories across all package ecosystems." },
  { icon: BarChart3, title: "Severity scoring", description: "CVSS-based scoring with contextual risk analysis per package." },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1080px] px-6">
        <motion.div
          className="mx-auto max-w-md text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-serif text-[2rem] font-[400] tracking-[-0.02em] md:text-[2.5rem]">
            Everything you need to stay secure
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
            One platform to monitor, alert, and respond to supply-chain threats.
          </p>
        </motion.div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-card p-6 transition-colors duration-200 hover:bg-muted/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <feature.icon className="h-[17px] w-[17px] text-foreground/80" strokeWidth={1.8} />
              </div>
              <h3 className="text-[14px] font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-[13px] leading-[1.7] text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
