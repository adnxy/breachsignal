"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  MessageSquare, Bell, Send, Mail, Settings, Zap, ExternalLink,
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
  { id: "1", type: "slack", label: "Slack", description: "Real-time alert cards in any channel with severity, package info, and advisory links.", icon: MessageSquare, connected: true, enabled: true },
  { id: "2", type: "pagerduty", label: "PagerDuty", description: "Auto-create incidents for critical and high severity vulnerabilities.", icon: Bell, connected: false, enabled: false },
  { id: "3", type: "telegram", label: "Telegram", description: "Push notifications to any chat or group with formatted messages.", icon: Send, connected: true, enabled: true },
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
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold tracking-tight">Integrations</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">{connectedCount} of {integrations.length} channels active</p>
      </div>

      {/* Integration list */}
      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isActive = integration.connected && integration.enabled;

          return (
            <div
              key={integration.id}
              className="flex items-center gap-4 px-4 py-4 sm:px-5 bg-card hover:bg-muted/30 transition-colors"
            >
              {/* Icon */}
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                isActive ? "bg-foreground/5 text-foreground" : "bg-muted text-muted-foreground/50"
              )}>
                <Icon className="h-4 w-4" strokeWidth={1.7} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-medium">{integration.label}</h3>
                  {isActive && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Active</span>
                    </span>
                  )}
                  {integration.connected && !integration.enabled && (
                    <span className="text-[10px] text-muted-foreground/50">Paused</span>
                  )}
                </div>
                <p className="mt-0.5 text-[12px] text-muted-foreground/60 truncate">{integration.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                {integration.connected && (
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={() => toggleEnabled(integration.id)}
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[12px] h-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setConfigOpen(integration.id)}
                >
                  {integration.connected ? (
                    <Settings className="h-3.5 w-3.5" strokeWidth={1.7} />
                  ) : (
                    <>
                      <Zap className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.7} />
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
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground/40">
          Webhooks and custom endpoints available on Team plan.
        </p>
        <Button variant="ghost" size="sm" className="text-[11px] h-7 text-muted-foreground/40 hover:text-muted-foreground">
          <ExternalLink className="mr-1 h-3 w-3" />
          Docs
        </Button>
      </div>

      {/* Config dialog */}
      <Dialog open={!!configOpen} onOpenChange={() => setConfigOpen(null)}>
        {configuring && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                {configuring.connected ? "Configure" : "Connect"} {configuring.label}
              </DialogTitle>
              <DialogDescription className="text-[13px] text-muted-foreground mt-1">
                {configuring.description}
              </DialogDescription>
            </DialogHeader>
            <form className="mt-4 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              setIntegrations((prev) => prev.map((i) => i.id === configuring.id ? { ...i, connected: true, enabled: true } : i));
              setConfigOpen(null);
            }}>
              {configuring.type === "slack" && (
                <div>
                  <Label htmlFor="webhook" className="text-[12px]">Webhook URL</Label>
                  <Input id="webhook" placeholder="https://hooks.slack.com/services/..." className="mt-1.5 text-[13px]" />
                </div>
              )}
              {configuring.type === "pagerduty" && (
                <div>
                  <Label htmlFor="routing-key" className="text-[12px]">Routing Key</Label>
                  <Input id="routing-key" placeholder="Enter your PagerDuty routing key" className="mt-1.5 text-[13px]" />
                </div>
              )}
              {configuring.type === "telegram" && (
                <>
                  <div>
                    <Label htmlFor="bot-token" className="text-[12px]">Bot Token</Label>
                    <Input id="bot-token" placeholder="123456:ABC-DEF..." className="mt-1.5 text-[13px]" />
                  </div>
                  <div>
                    <Label htmlFor="chat-id" className="text-[12px]">Chat ID</Label>
                    <Input id="chat-id" placeholder="-1001234567890" className="mt-1.5 text-[13px]" />
                  </div>
                </>
              )}
              {configuring.type === "email" && (
                <div>
                  <Label htmlFor="email" className="text-[12px]">Email Address</Label>
                  <Input id="email" type="email" placeholder="alerts@company.com" className="mt-1.5 text-[13px]" defaultValue="jane@company.com" />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 text-[13px]" onClick={() => setConfigOpen(null)}>Cancel</Button>
                <Button type="submit" className="flex-1 text-[13px]">{configuring.connected ? "Save" : "Connect"}</Button>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
