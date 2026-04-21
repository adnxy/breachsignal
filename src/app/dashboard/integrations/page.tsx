"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  MessageSquare, Bell, Send, Mail, CheckCircle2, Settings, ArrowUpRight, Zap,
} from "lucide-react";

interface Integration {
  id: string;
  type: "slack" | "pagerduty" | "telegram" | "email";
  label: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  enabled: boolean;
}

const initialIntegrations: Integration[] = [
  { id: "1", type: "slack", label: "Slack", description: "Get real-time alert cards in any channel with severity, package info, and advisory links.", icon: MessageSquare, connected: true, enabled: true },
  { id: "2", type: "pagerduty", label: "PagerDuty", description: "Auto-create incidents for critical and high severity vulnerabilities in your stack.", icon: Bell, connected: false, enabled: false },
  { id: "3", type: "telegram", label: "Telegram", description: "Instant push notifications to any chat or group with formatted messages.", icon: Send, connected: true, enabled: true },
  { id: "4", type: "email", label: "Email", description: "Critical alerts and configurable daily or weekly digest summaries.", icon: Mail, connected: true, enabled: true },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [configOpen, setConfigOpen] = useState<string | null>(null);

  function toggleEnabled(id: string) {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)));
  }

  const configuring = integrations.find((i) => i.id === configOpen);
  const connectedCount = integrations.filter((i) => i.connected && i.enabled).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description={`${connectedCount} of ${integrations.length} channels active`}
      />

      {/* Integration cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isActive = integration.connected && integration.enabled;

          return (
            <div
              key={integration.id}
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300 ease-out",
                "hover:-translate-y-[2px] hover:shadow-[0_4px_16px_oklch(0_0_0/0.06),0_12px_40px_oklch(0_0_0/0.04)]",
                isActive
                  ? "border-[var(--success)]/20 shadow-[0_0_0_1px_var(--success)/8,0_2px_8px_oklch(0_0_0/0.03)]"
                  : "border-border shadow-[0_1px_3px_oklch(0_0_0/0.04)]",
              )}
            >
              {/* Top row: Icon + Status */}
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-[14px] transition-all duration-300",
                  isActive
                    ? "bg-[var(--success)]/[0.08] text-[var(--success)] group-hover:bg-[var(--success)]/[0.12]"
                    : "bg-muted text-muted-foreground/50 group-hover:bg-muted/80 group-hover:text-muted-foreground/70"
                )}>
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.5} />
                </div>

                {isActive && (
                  <div className="flex items-center gap-1.5 rounded-full bg-[var(--success)]/[0.08] px-2.5 py-1">
                    <span className="relative flex h-[6px] w-[6px]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)]/40 duration-[2500ms]" />
                      <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[var(--success)]" />
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--success)]">Active</span>
                  </div>
                )}
                {integration.connected && !integration.enabled && (
                  <span className="text-[10px] font-medium text-muted-foreground/40 bg-muted/60 px-2.5 py-1 rounded-full">Paused</span>
                )}
                {!integration.connected && (
                  <span className="text-[10px] font-medium text-muted-foreground/30 bg-muted/40 px-2.5 py-1 rounded-full">Not connected</span>
                )}
              </div>

              {/* Title + Description */}
              <div className="flex-1 mb-5">
                <h3 className="text-[15px] font-semibold tracking-[-0.02em] mb-1.5">{integration.label}</h3>
                <p className="text-[12px] text-muted-foreground/50 leading-[1.6] group-hover:text-muted-foreground/70 transition-colors duration-200">
                  {integration.description}
                </p>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                {integration.connected ? (
                  <div className="flex items-center gap-2.5">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={() => toggleEnabled(integration.id)}
                    />
                    <span className="text-[11px] font-medium text-muted-foreground/40">
                      {integration.enabled ? "On" : "Off"}
                    </span>
                  </div>
                ) : (
                  <div />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] h-8 font-medium rounded-lg opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => setConfigOpen(integration.id)}
                >
                  {integration.connected ? (
                    <>
                      <Settings className="mr-1.5 h-3 w-3" strokeWidth={1.8} />
                      Settings
                    </>
                  ) : (
                    <>
                      <Zap className="mr-1.5 h-3 w-3" strokeWidth={1.8} />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-[11px] text-muted-foreground/30 text-center">
        Need webhooks or a custom endpoint? Available on the Team plan.
      </p>

      {/* Config dialog */}
      <Dialog open={!!configOpen} onOpenChange={() => setConfigOpen(null)}>
        {configuring && (
          <DialogContent className="max-w-md rounded-2xl border-border/50 shadow-[0_0_0_1px_oklch(0_0_0/0.04),0_24px_64px_oklch(0_0_0/0.12)]">
            <DialogHeader>
              <DialogTitle className="text-[16px] font-semibold tracking-tight">
                {configuring.connected ? "Configure" : "Connect"} {configuring.label}
              </DialogTitle>
              <DialogDescription className="text-[12px] text-muted-foreground/50 leading-relaxed mt-1">
                {configuring.description}
              </DialogDescription>
            </DialogHeader>
            <form className="mt-5 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              setIntegrations((prev) => prev.map((i) => i.id === configuring.id ? { ...i, connected: true, enabled: true } : i));
              setConfigOpen(null);
            }}>
              {configuring.type === "slack" && (
                <div>
                  <Label htmlFor="webhook" className="text-[12px] font-medium">Webhook URL</Label>
                  <Input id="webhook" placeholder="https://hooks.slack.com/services/..." className="mt-2 text-[13px] h-10" />
                </div>
              )}
              {configuring.type === "pagerduty" && (
                <div>
                  <Label htmlFor="routing-key" className="text-[12px] font-medium">Routing Key</Label>
                  <Input id="routing-key" placeholder="Enter your PagerDuty routing key" className="mt-2 text-[13px] h-10" />
                </div>
              )}
              {configuring.type === "telegram" && (
                <>
                  <div>
                    <Label htmlFor="bot-token" className="text-[12px] font-medium">Bot Token</Label>
                    <Input id="bot-token" placeholder="123456:ABC-DEF..." className="mt-2 text-[13px] h-10" />
                  </div>
                  <div>
                    <Label htmlFor="chat-id" className="text-[12px] font-medium">Chat ID</Label>
                    <Input id="chat-id" placeholder="-1001234567890" className="mt-2 text-[13px] h-10" />
                  </div>
                </>
              )}
              {configuring.type === "email" && (
                <div>
                  <Label htmlFor="email" className="text-[12px] font-medium">Email Address</Label>
                  <Input id="email" type="email" placeholder="alerts@company.com" className="mt-2 text-[13px] h-10" defaultValue="jane@company.com" />
                </div>
              )}
              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" className="flex-1 text-[12px] h-10 font-medium" onClick={() => setConfigOpen(null)}>Cancel</Button>
                <Button type="submit" className="flex-1 text-[12px] h-10 font-medium">{configuring.connected ? "Save" : "Connect"}</Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
