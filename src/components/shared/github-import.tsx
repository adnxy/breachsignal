"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Check,
  Lock,
  Globe,
  GitBranch,
  ChevronDown,
  Upload,
  FileJson,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ─── Mock GitHub repos (simulates OAuth repo list) ─── */
const GITHUB_REPOS = [
  { id: "1", owner: "acme-corp", name: "web-app", fullName: "acme-corp/web-app", language: "TypeScript", private: true, updatedAt: "2d ago" },
  { id: "2", owner: "acme-corp", name: "api-server", fullName: "acme-corp/api-server", language: "Go", private: true, updatedAt: "5h ago" },
  { id: "3", owner: "acme-corp", name: "design-system", fullName: "acme-corp/design-system", language: "TypeScript", private: false, updatedAt: "1w ago" },
  { id: "4", owner: "acme-corp", name: "mobile-app", fullName: "acme-corp/mobile-app", language: "Dart", private: true, updatedAt: "3h ago" },
  { id: "5", owner: "acme-corp", name: "infra", fullName: "acme-corp/infra", language: "HCL", private: true, updatedAt: "12h ago" },
  { id: "6", owner: "acme-corp", name: "docs", fullName: "acme-corp/docs", language: "MDX", private: false, updatedAt: "4d ago" },
  { id: "7", owner: "acme-corp", name: "analytics", fullName: "acme-corp/analytics", language: "Python", private: true, updatedAt: "1d ago" },
  { id: "8", owner: "acme-corp", name: "auth-service", fullName: "acme-corp/auth-service", language: "Rust", private: true, updatedAt: "6h ago" },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400",
  Go: "bg-cyan-400",
  Dart: "bg-sky-400",
  HCL: "bg-purple-400",
  MDX: "bg-yellow-400",
  Python: "bg-yellow-500",
  Rust: "bg-orange-400",
  JavaScript: "bg-yellow-300",
};

/* ─── GitHub Repo Picker (Vercel-style multi-select) ─── */
export function GitHubRepoPicker({
  onImport,
  compact = false,
}: {
  onImport?: (repos: typeof GITHUB_REPOS) => void;
  compact?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  const filtered = GITHUB_REPOS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleImport() {
    if (selected.size === 0) return;
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
      const repos = GITHUB_REPOS.filter((r) => selected.has(r.id));
      onImport?.(repos);
      setTimeout(() => {
        setDone(false);
        setSelected(new Set());
      }, 2000);
    }, 1500);
  }

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "w-full bg-transparent pl-9 pr-3 text-[13px] placeholder:text-muted-foreground/30 outline-none border-b border-border/40",
            compact ? "py-2.5" : "py-3"
          )}
        />
      </div>

      {/* Repo list */}
      <div className={cn(
        "overflow-y-auto divide-y divide-border/20",
        compact ? "max-h-[200px]" : "max-h-[280px]"
      )}>
        {filtered.map((repo) => {
          const isSelected = selected.has(repo.id);
          return (
            <button
              key={repo.id}
              type="button"
              onClick={() => toggle(repo.id)}
              className={cn(
                "flex w-full items-center gap-3 px-3 transition-colors duration-75 text-left cursor-pointer",
                compact ? "py-2" : "py-2.5",
                isSelected
                  ? "bg-foreground/[0.03]"
                  : "hover:bg-foreground/[0.02]"
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-100",
                  isSelected
                    ? "border-foreground bg-foreground"
                    : "border-border/60 bg-transparent"
                )}
              >
                {isSelected && (
                  <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />
                )}
              </div>

              {/* Visibility */}
              {repo.private ? (
                <Lock className="h-3 w-3 text-muted-foreground/30 shrink-0" />
              ) : (
                <Globe className="h-3 w-3 text-muted-foreground/30 shrink-0" />
              )}

              {/* Name */}
              <div className="flex-1 min-w-0">
                <span className="text-[12px] font-mono">
                  <span className="text-muted-foreground/40">{repo.owner}/</span>
                  <span className="font-medium text-foreground/80">{repo.name}</span>
                </span>
              </div>

              {/* Language */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={cn("h-2 w-2 rounded-full", LANG_COLORS[repo.language] || "bg-gray-400")} />
                <span className="text-[10px] text-muted-foreground/35">{repo.language}</span>
              </div>

              {/* Updated */}
              <span className="text-[10px] text-muted-foreground/25 tabular-nums shrink-0 w-[36px] text-right">
                {repo.updatedAt}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-3 py-6 text-center text-[12px] text-muted-foreground/35">
            No repositories match &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      {/* Import bar */}
      <div className={cn(
        "flex items-center justify-between border-t border-border/40",
        compact ? "px-3 py-2.5" : "px-3 py-3"
      )}>
        <span className="text-[11px] text-muted-foreground/40">
          {selected.size > 0 ? (
            <>{selected.size} selected</>
          ) : (
            <>Select repositories to import</>
          )}
        </span>
        <Button
          size="sm"
          disabled={selected.size === 0 || importing}
          onClick={handleImport}
          className={cn(
            "h-7 rounded-lg px-3 text-[11px] font-medium transition-all",
            done && "bg-[var(--success)] hover:bg-[var(--success)]"
          )}
        >
          {importing ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Importing...
            </>
          ) : done ? (
            <>
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Imported
            </>
          ) : (
            <>
              Import{selected.size > 0 && ` ${selected.size}`}
              <ArrowRight className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* ─── Upload Zone (drag & drop package.json) ─── */
export function UploadZone({
  compact = false,
  onUpload,
}: {
  compact?: boolean;
  onUpload?: (names: string[]) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<{ imported: string[]; skipped: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((content: string) => {
    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const parsed = JSON.parse(content);
      const deps = { ...parsed.dependencies, ...parsed.devDependencies };
      if (!deps || Object.keys(deps).length === 0) {
        setError("No dependencies found.");
        setProcessing(false);
        return;
      }
      const imported = Object.keys(deps);
      setResult({ imported, skipped: [] });
      onUpload?.(imported);
    } catch {
      setError("Invalid JSON file.");
    } finally {
      setProcessing(false);
    }
  }, [onUpload]);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".json")) {
      setError("Please upload a .json file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => processFile(e.target?.result as string);
    reader.readAsText(file);
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  if (result) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-center", compact ? "px-4 py-6" : "px-6 py-10")}>
        <CheckCircle2 className="h-6 w-6 text-[var(--success)] mb-2" />
        <p className="text-[13px] font-medium text-[var(--success)]">
          {result.imported.length} package{result.imported.length !== 1 ? "s" : ""} detected
        </p>
        <div className="mt-3 flex flex-wrap gap-1 justify-center max-w-xs">
          {result.imported.slice(0, 8).map((name) => (
            <code key={name} className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono">{name}</code>
          ))}
          {result.imported.length > 8 && (
            <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{result.imported.length - 8} more
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => { setResult(null); setError(null); }}
          className="mt-3 text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
        >
          Upload another
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-center", compact ? "px-4 py-6" : "px-6 py-10")}>
        <AlertCircle className="h-5 w-5 text-[var(--severity-critical)] mb-2" />
        <p className="text-[12px] text-[var(--severity-critical)]">{error}</p>
        <button
          type="button"
          onClick={() => setError(null)}
          className="mt-2 text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
        compact ? "px-4 py-6" : "px-6 py-10",
        dragActive ? "bg-foreground/[0.03]" : "hover:bg-foreground/[0.015]"
      )}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl transition-colors mb-3",
        dragActive ? "bg-foreground/[0.06]" : "bg-foreground/[0.03]"
      )}>
        <FileJson className={cn(
          "h-5 w-5 transition-colors",
          dragActive ? "text-foreground/50" : "text-muted-foreground/30"
        )} />
      </div>
      <p className="text-[12px] font-medium text-foreground/60">
        {dragActive ? "Drop to scan" : "Drop package.json"}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground/35">
        or requirements.txt, go.mod, Cargo.toml
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,.toml,.mod"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {processing && <Loader2 className="mt-3 h-4 w-4 animate-spin text-muted-foreground/40" />}
    </div>
  );
}

/* ─── Manual Add ─── */
export function ManualAdd({
  compact = false,
  onAdd,
}: {
  compact?: boolean;
  onAdd?: (name: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;
    onAdd?.(name);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "px-4 py-6" : "px-6 py-10"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.03] mb-3">
        <Plus className="h-5 w-5 text-muted-foreground/30" />
      </div>
      <p className="text-[12px] font-medium text-foreground/60 mb-3">Add package manually</p>
      <div className="flex items-center gap-2 w-full max-w-[280px]">
        <input
          type="text"
          placeholder="e.g. lodash, @tanstack/react-query"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 h-8 rounded-lg border border-border/40 bg-transparent px-3 text-[12px] placeholder:text-muted-foreground/30 outline-none focus:border-border/80 transition-colors"
        />
        <Button type="submit" size="sm" className="h-8 rounded-lg px-3 text-[11px]" disabled={!value.trim()}>
          Add
        </Button>
      </div>
    </form>
  );
}
