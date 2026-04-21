"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[11px] font-[650] uppercase tracking-[0.08em] text-muted-foreground/35">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <div>
            <Label htmlFor="name" className="text-[12px] font-[550]">Name</Label>
            <Input id="name" defaultValue="Jane Smith" className="mt-1.5 text-[12px] h-9" />
          </div>
          <div>
            <Label htmlFor="email" className="text-[12px] font-[550]">Email</Label>
            <Input id="email" type="email" defaultValue="jane@company.com" className="mt-1.5 text-[12px] h-9" />
          </div>
          <Button size="sm" className="text-[11px] h-8 font-[550]">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[11px] font-[650] uppercase tracking-[0.08em] text-muted-foreground/35">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {[
            { title: "Critical alerts", desc: "Immediate notification for critical severity", checked: true },
            { title: "Daily digest", desc: "Summary of all alerts from the past 24 hours", checked: true },
            { title: "Weekly report", desc: "Weekly overview of your security posture", checked: false },
          ].map((item, i) => (
            <div key={item.title}>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[12px] font-[550]">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground/35 mt-0.5">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
              {i < 2 && <Separator className="bg-border/[0.06]" />}
            </div>
          ))}
          <div className="pt-3">
            <Label className="text-[12px] font-[550]">Minimum severity for instant alerts</Label>
            <Select defaultValue="high">
              <SelectTrigger className="mt-1.5 w-44 text-[12px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical" className="text-[12px]">Critical only</SelectItem>
                <SelectItem value="high" className="text-[12px]">High and above</SelectItem>
                <SelectItem value="medium" className="text-[12px]">Medium and above</SelectItem>
                <SelectItem value="low" className="text-[12px]">All severities</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[11px] font-[650] uppercase tracking-[0.08em] text-muted-foreground/35">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-[12px] font-[550]">Theme</Label>
          <Select defaultValue="system">
            <SelectTrigger className="mt-1.5 w-44 text-[12px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light" className="text-[12px]">Light</SelectItem>
              <SelectItem value="dark" className="text-[12px]">Dark</SelectItem>
              <SelectItem value="system" className="text-[12px]">System</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-[var(--severity-critical)]/[0.08] shadow-[0_0_0_1px_color-mix(in_oklch,var(--severity-critical)_3%,transparent)]">
        <CardHeader>
          <CardTitle className="text-[11px] font-[650] uppercase tracking-[0.08em] text-[var(--severity-critical)]/40">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-[550]">Delete Account</p>
              <p className="text-[10px] text-muted-foreground/35 mt-0.5">Permanently remove your account and all data.</p>
            </div>
            <Button variant="outline" size="sm" className="text-[11px] h-7 text-[var(--severity-critical)]/70 border-[var(--severity-critical)]/15 hover:bg-[var(--severity-critical)]/[0.04] hover:text-[var(--severity-critical)] font-[550]">
              <Trash2 className="mr-1.5 h-3 w-3" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
