"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GitHubRepoPicker, UploadZone, ManualAdd } from "@/components/shared/github-import";
import { GitBranch, Upload, Plus, X, ArrowRight, CheckCircle2, Shield } from "lucide-react";

const tabs = [
  { id: "github" as const, label: "GitHub", fullLabel: "Import from GitHub", icon: GitBranch, description: "Connect repos for automatic scanning" },
  { id: "upload" as const, label: "Upload", fullLabel: "Upload manifest", icon: Upload, description: "Drop package.json or similar" },
  { id: "manual" as const, label: "Manual", fullLabel: "Add manually", icon: Plus, description: "Search packages by name" },
];

type Tab = typeof tabs[number]["id"];

export function ImportBanner({ onDismiss }: { onDismiss?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("github");

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--success)]/8">
            <Shield className="h-4 w-4 text-[var(--success)]" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold tracking-[-0.02em]">Import project</h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground/60">
              Connect your project to start scanning for vulnerabilities.
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.06] transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Tabs — card style */}
      <div className="flex items-stretch gap-2 px-5 sm:px-6 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-100 cursor-pointer text-left",
              activeTab === tab.id
                ? "border-foreground/20 bg-foreground/[0.04] text-foreground"
                : "border-transparent text-muted-foreground/60 hover:text-muted-foreground/80 hover:bg-foreground/[0.04]"
            )}
          >
            <div className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
              activeTab === tab.id ? "bg-foreground/[0.08]" : "bg-foreground/[0.04]"
            )}>
              <tab.icon className="h-3.5 w-3.5" strokeWidth={activeTab === tab.id ? 2 : 1.5} />
            </div>
            <div className="min-w-0">
              <span className="text-[12px] font-medium block">{tab.label}</span>
              <span className="text-[10px] text-muted-foreground/50 hidden sm:block">{tab.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-border/50 mt-3" />

      {/* Content */}
      {activeTab === "github" && <GitHubRepoPicker />}
      {activeTab === "upload" && <UploadZone />}
      {activeTab === "manual" && <ManualAdd />}
    </div>
  );
}
