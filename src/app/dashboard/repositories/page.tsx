"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { TimeAgo } from "@/components/shared/time-ago";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_GITHUB_REPOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  GitBranch, Search, MoreHorizontal, Trash2, ExternalLink, RefreshCw,
  ShieldCheck, ShieldAlert, Lock, Globe, ArrowRight, Shield, Check,
  Loader2, CheckCircle2, Eye, Zap, ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GitHubRepo } from "@/types";

const AVAILABLE_REPOS = [
  { id: "g1", owner: "acme-corp", name: "web-app", fullName: "acme-corp/web-app", language: "TypeScript", private: true, updatedAt: "2d ago", stars: 142, description: "Main web application" },
  { id: "g2", owner: "acme-corp", name: "api-server", fullName: "acme-corp/api-server", language: "Go", private: true, updatedAt: "5h ago", stars: 89, description: "REST & GraphQL API" },
  { id: "g3", owner: "acme-corp", name: "design-system", fullName: "acme-corp/design-system", language: "TypeScript", private: false, updatedAt: "1w ago", stars: 234, description: "Shared UI component library" },
  { id: "g4", owner: "acme-corp", name: "mobile-app", fullName: "acme-corp/mobile-app", language: "Dart", private: true, updatedAt: "3h ago", stars: 56, description: "Flutter mobile application" },
  { id: "g5", owner: "acme-corp", name: "infra", fullName: "acme-corp/infra", language: "HCL", private: true, updatedAt: "12h ago", stars: 12, description: "Terraform infrastructure" },
  { id: "g6", owner: "acme-corp", name: "docs", fullName: "acme-corp/docs", language: "MDX", private: false, updatedAt: "4d ago", stars: 45, description: "Documentation site" },
  { id: "g7", owner: "acme-corp", name: "analytics", fullName: "acme-corp/analytics", language: "Python", private: true, updatedAt: "1d ago", stars: 33, description: "Data pipeline & analytics" },
  { id: "g8", owner: "acme-corp", name: "auth-service", fullName: "acme-corp/auth-service", language: "Rust", private: true, updatedAt: "6h ago", stars: 78, description: "Authentication microservice" },
  { id: "g9", owner: "acme-corp", name: "ml-models", fullName: "acme-corp/ml-models", language: "Python", private: true, updatedAt: "2d ago", stars: 21, description: "Machine learning models" },
  { id: "g10", owner: "acme-corp", name: "chrome-extension", fullName: "acme-corp/chrome-extension", language: "JavaScript", private: false, updatedAt: "3w ago", stars: 167, description: "Browser extension" },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400", Go: "bg-cyan-400", Dart: "bg-sky-400",
  HCL: "bg-purple-400", MDX: "bg-yellow-400", Python: "bg-yellow-500",
  Rust: "bg-orange-400", JavaScript: "bg-yellow-300",
};

type View = "connected" | "import";

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>(MOCK_GITHUB_REPOS);
  const [search, setSearch] = useState("");
  const [scanning, setScanning] = useState<string | null>(null);
  const [view, setView] = useState<View>("connected");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filtered = repos.filter((r) => r.fullName.toLowerCase().includes(search.toLowerCase()));
  const totalVulns = repos.reduce((sum, r) => sum + r.vulnerabilities, 0);
  const secureRepos = repos.filter((r) => r.vulnerabilities === 0).length;

  function handleRemove(id: string) { setRepos((prev) => prev.filter((r) => r.id !== id)); }
  function handleRescan(id: string) { setScanning(id); setTimeout(() => setScanning(null), 2000); }

  if (view === "import") {
    return (
      <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
        <ImportView
          onBack={() => setView("connected")}
          connectedIds={new Set(repos.map(r => r.fullName))}
          onImported={(newRepos) => { setRepos(prev => [...prev, ...newRepos]); setView("connected"); }}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      <PageHeader
        title="Repositories"
        description="GitHub repositories connected for vulnerability scanning."
        action={
          <Button size="sm" className="text-sm h-8" onClick={() => setView("import")}>
            <GitBranch className="mr-1.5 h-3.5 w-3.5" />
            Import from GitHub
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Connected</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{repos.length}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Vulnerabilities</p>
          <p className={cn("mt-1 text-2xl font-semibold tabular-nums tracking-tight", totalVulns > 0 && "text-[var(--severity-high)]")}>{totalVulns}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Secure</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-emerald-500">{secureRepos}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search repositories..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full max-w-xs rounded-lg border border-border bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all" />
      </div>

      <Card className="border-border shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Repository</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Language</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Branch</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Vulnerabilities</th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Last Scan</th>
                  <th className="px-4 py-2.5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((repo) => (
                  <tr key={repo.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {repo.private ? <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                        <span className="text-sm font-mono"><span className="text-muted-foreground">{repo.owner}/</span>{repo.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5"><span className="text-xs text-muted-foreground">{repo.language || "—"}</span></td>
                    <td className="px-4 py-2.5">
                      <code className="text-xs font-mono text-muted-foreground bg-muted rounded px-1.5 py-0.5">{repo.defaultBranch}</code>
                    </td>
                    <td className="px-4 py-2.5">
                      {repo.vulnerabilities > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <ShieldAlert className="h-3.5 w-3.5 text-[var(--severity-high)]" strokeWidth={1.6} />
                          <span className="text-xs font-semibold tabular-nums text-[var(--severity-high)]">{repo.vulnerabilities}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.6} />
                          <span className="text-xs text-emerald-500">Secure</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {repo.lastScanAt ? <TimeAgo date={repo.lastScanAt} /> : (
                        <span className={cn(scanning === repo.id && "animate-pulse")}>{scanning === repo.id ? "Scanning..." : "Pending"}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-sm" onClick={() => handleRescan(repo.id)}><RefreshCw className="mr-2 h-3.5 w-3.5" />Rescan</DropdownMenuItem>
                          <DropdownMenuItem className="text-sm" onClick={() => window.open(`https://github.com/${repo.fullName}`, "_blank")}><ExternalLink className="mr-2 h-3.5 w-3.5" />View on GitHub</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive text-sm" onClick={() => handleRemove(repo.id)}><Trash2 className="mr-2 h-3.5 w-3.5" />Disconnect</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <GitBranch className="h-8 w-8 text-muted-foreground mb-4" strokeWidth={1.5} />
              <p className="text-base font-semibold">{search ? "No repositories found" : "No repositories connected"}</p>
              <p className="mt-1.5 max-w-[320px] text-sm text-muted-foreground">
                {search ? "Try a different search term." : "Connect your GitHub repositories to automatically scan every dependency for known vulnerabilities."}
              </p>
              {!search && (
                <Button size="sm" className="mt-6 text-sm h-9 px-5" onClick={() => setView("import")}>
                  <GitBranch className="mr-1.5 h-3.5 w-3.5" />Import from GitHub<ArrowRight className="ml-1.5 h-3.5 w-3.5 opacity-60" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ImportView({ onBack, connectedIds, onImported }: { onBack: () => void; connectedIds: Set<string>; onImported: (repos: GitHubRepo[]) => void }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [connected, setConnected] = useState(false);

  const filtered = AVAILABLE_REPOS.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.fullName.toLowerCase().includes(search.toLowerCase()));

  function toggle(id: string) {
    setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  function selectAll() {
    const allFilteredIds = filtered.filter(r => !connectedIds.has(r.fullName)).map(r => r.id);
    const allSelected = allFilteredIds.every(id => selected.has(id));
    setSelected(allSelected ? new Set() : new Set(allFilteredIds));
  }

  function handleImport() {
    if (selected.size === 0) return;
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
      const selectedRepos = AVAILABLE_REPOS.filter((r) => selected.has(r.id));
      const newGitHubRepos: GitHubRepo[] = selectedRepos.map((r) => ({
        id: `imported-${r.id}`, owner: r.owner, name: r.name, fullName: r.fullName,
        defaultBranch: "main", language: r.language, private: r.private, vulnerabilities: 0, lastScanAt: null,
      }));
      setTimeout(() => onImported(newGitHubRepos), 1500);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" />Back to repositories
        </button>
        <h1 className="text-2xl font-semibold tracking-tight">Import from GitHub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Select repositories to connect and start scanning for vulnerabilities.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Eye, label: "Read-only access", desc: "We never touch your code" },
          { icon: Zap, label: "Instant scanning", desc: "Vulnerabilities found in seconds" },
          { icon: RefreshCw, label: "Auto re-scan", desc: "Triggered on every push" },
        ].map((feature) => (
          <div key={feature.label} className="flex items-center gap-3 rounded-xl border border-border p-4">
            <feature.icon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.7} />
            <div>
              <p className="text-sm font-medium">{feature.label}</p>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {!connected ? (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted mb-4">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-foreground" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold tracking-tight">Connect your GitHub account</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Authorize BreachSignal to access your repositories. We only request read-only permissions.
            </p>
            <Button size="sm" className="mt-6 h-9 px-5 text-sm gap-2" onClick={() => setConnected(true)}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Connect GitHub<ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </Button>
            <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" />Encrypted</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3" />No code stored</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-foreground" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <div>
                <p className="text-sm font-medium">acme-corp</p>
                <p className="text-xs text-muted-foreground">{AVAILABLE_REPOS.length} repositories available</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-500 font-medium">Connected</span>
            </div>
          </div>

          <div className="flex items-center border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Search repositories..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent pl-10 pr-3 py-3 text-sm placeholder:text-muted-foreground outline-none" />
            </div>
            <button type="button" onClick={selectAll} className="shrink-0 px-4 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {filtered.filter(r => !connectedIds.has(r.fullName)).every(r => selected.has(r.id)) ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {filtered.map((repo) => {
              const isSelected = selected.has(repo.id);
              const isConnected = connectedIds.has(repo.fullName);
              return (
                <button key={repo.id} type="button" disabled={isConnected} onClick={() => !isConnected && toggle(repo.id)}
                  className={cn("flex w-full items-center gap-4 px-5 py-3 transition-colors text-left",
                    isConnected ? "opacity-40 cursor-not-allowed" : isSelected ? "bg-muted/50 cursor-pointer" : "hover:bg-muted/30 cursor-pointer"
                  )}>
                  <div className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all",
                    isConnected ? "border-emerald-500/30 bg-emerald-500/10" : isSelected ? "border-foreground bg-foreground" : "border-border"
                  )}>
                    {(isSelected || isConnected) && <Check className={cn("h-2.5 w-2.5", isConnected ? "text-emerald-500" : "text-background")} strokeWidth={3} />}
                  </div>
                  {repo.private ? <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono"><span className="text-muted-foreground">{repo.owner}/</span><span className="font-medium">{repo.name}</span></span>
                      {isConnected && <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">Connected</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{repo.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={cn("h-2 w-2 rounded-full", LANG_COLORS[repo.language] || "bg-gray-400")} />
                    <span className="text-xs text-muted-foreground">{repo.language}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 w-10 text-right hidden sm:block">{repo.updatedAt}</span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && <div className="px-5 py-10 text-center text-sm text-muted-foreground">No repositories match your search.</div>}

          <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
            <div className="text-sm text-muted-foreground">
              {selected.size > 0 ? <span className="font-medium text-foreground">{selected.size} repositor{selected.size === 1 ? "y" : "ies"} selected</span> : "Select repositories to import"}
            </div>
            <Button size="sm" disabled={selected.size === 0 || importing || done} onClick={handleImport}
              className={cn("h-9 px-5 text-sm transition-all", done && "bg-emerald-500 hover:bg-emerald-500")}>
              {importing ? (<><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Importing...</>) :
               done ? (<><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Imported</>) :
               (<>Import{selected.size > 0 && ` ${selected.size}`}<ArrowRight className="ml-1.5 h-3.5 w-3.5" /></>)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
