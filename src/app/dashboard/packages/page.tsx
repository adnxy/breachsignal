"use client";

import { useState, useCallback, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { TimeAgo } from "@/components/shared/time-ago";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_PACKAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Plus,
  Upload,
  Search,
  Package,
  MoreHorizontal,
  VolumeX,
  Trash2,
  ExternalLink,
  FileJson,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TrackedPackage } from "@/types";

interface UploadResult {
  imported: string[];
  skipped: string[];
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<TrackedPackage[]>(MOCK_PACKAGES);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = packages.filter((p) =>
    p.packageName.toLowerCase().includes(search.toLowerCase())
  );

  function handleRemove(id: string) {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  }

  function handleToggleMute(id: string) {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, muted: !p.muted } : p))
    );
  }

  const processPackageJson = useCallback((content: string) => {
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const parsed = JSON.parse(content);
      const deps = {
        ...parsed.dependencies,
        ...parsed.devDependencies,
      };

      if (!deps || Object.keys(deps).length === 0) {
        setUploadError("No dependencies found in this file.");
        setUploading(false);
        return;
      }

      const depNames = Object.keys(deps);
      const existingNames = new Set(packages.map((p) => p.packageName));
      const imported: string[] = [];
      const skipped: string[] = [];

      const newPackages: TrackedPackage[] = [];

      for (const name of depNames) {
        if (existingNames.has(name)) {
          skipped.push(name);
          continue;
        }
        imported.push(name);
        const version = deps[name].replace(/[\^~>=<]/g, "");
        newPackages.push({
          id: `upload-${Date.now()}-${name}`,
          packageName: name,
          currentVersion: version,
          latestSafeVersion: version,
          ecosystem: "npm",
          status: "safe",
          lastAlertAt: null,
          muted: false,
        });
      }

      if (newPackages.length > 0) {
        setPackages((prev) => [...newPackages, ...prev]);
      }
      setUploadResult({ imported, skipped });
    } catch {
      setUploadError("Invalid JSON. Please upload a valid package.json file.");
    } finally {
      setUploading(false);
    }
  }, [packages]);

  const handleFile = useCallback((file: File) => {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setUploadError("Please upload a .json file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processPackageJson(content);
    };
    reader.readAsText(file);
  }, [processPackageJson]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const resetUpload = () => {
    setUploadResult(null);
    setUploadError(null);
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Packages"
        description="Packages you're monitoring for security advisories."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-[13px] h-8" onClick={() => { resetUpload(); setUploadOpen(true); }}>
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Upload
            </Button>
            <Dialog open={uploadOpen} onOpenChange={(o) => { setUploadOpen(o); if (!o) resetUpload(); }}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-[15px]">Upload package.json</DialogTitle>
                  <DialogDescription className="text-[13px]">
                    We&apos;ll automatically track all dependencies in your manifest file.
                  </DialogDescription>
                </DialogHeader>

                {!uploadResult && !uploadError && (
                  <div className="mt-3">
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors cursor-pointer",
                        dragActive
                          ? "border-foreground/30 bg-muted/60"
                          : "border-border/50 bg-muted/20 hover:bg-muted/40"
                      )}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <FileJson className={cn(
                          "mx-auto mb-3 h-8 w-8 transition-colors",
                          dragActive ? "text-foreground/50" : "text-muted-foreground/40"
                        )} />
                        <p className="text-[13px] font-medium">
                          {dragActive ? "Drop to upload" : "Drop your package.json here"}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground/70">
                          or click to browse
                        </p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
                    {uploading && (
                      <p className="mt-3 text-center text-[12px] text-muted-foreground">Processing...</p>
                    )}
                  </div>
                )}

                {uploadError && (
                  <div className="mt-3">
                    <div className="flex items-start gap-3 rounded-lg bg-[var(--severity-critical)]/5 border border-[var(--severity-critical)]/10 p-4">
                      <AlertCircle className="h-4 w-4 shrink-0 text-[var(--severity-critical)] mt-0.5" />
                      <div>
                        <p className="text-[13px] font-medium text-[var(--severity-critical)]">Upload failed</p>
                        <p className="mt-0.5 text-[12px] text-muted-foreground">{uploadError}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-3 w-full text-[13px] h-9" onClick={resetUpload}>
                      Try Again
                    </Button>
                  </div>
                )}

                {uploadResult && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-[var(--success)]/5 border border-[var(--success)]/10 p-4">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)] mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[var(--success)]">
                          {uploadResult.imported.length} package{uploadResult.imported.length !== 1 ? "s" : ""} imported
                        </p>
                        {uploadResult.skipped.length > 0 && (
                          <p className="mt-0.5 text-[12px] text-muted-foreground">
                            {uploadResult.skipped.length} already tracked
                          </p>
                        )}
                      </div>
                    </div>

                    {uploadResult.imported.length > 0 && (
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground/60 mb-2">Added</p>
                        <div className="flex flex-wrap gap-1.5">
                          {uploadResult.imported.slice(0, 20).map((name) => (
                            <code key={name} className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-mono">
                              {name}
                            </code>
                          ))}
                          {uploadResult.imported.length > 20 && (
                            <span className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                              +{uploadResult.imported.length - 20} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button className="w-full text-[13px] h-9" onClick={() => setUploadOpen(false)}>
                      Done
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Button size="sm" className="text-[13px] h-8" onClick={() => setAddOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Package
            </Button>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-[15px]">Add Package</DialogTitle>
                  <DialogDescription className="text-[13px]">
                    Enter the name of an npm package to start monitoring.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="mt-3 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const nameInput = form.elements.namedItem("pkg-name") as HTMLInputElement;
                    const versionInput = form.elements.namedItem("pkg-version") as HTMLInputElement;
                    const name = nameInput.value.trim();
                    if (!name) return;
                    const version = versionInput.value.trim().replace(/[\^~>=<]/g, "") || "latest";
                    setPackages((prev) => [{
                      id: `manual-${Date.now()}`,
                      packageName: name,
                      currentVersion: version,
                      latestSafeVersion: version,
                      ecosystem: "npm",
                      status: "safe",
                      lastAlertAt: null,
                      muted: false,
                    }, ...prev]);
                    setAddOpen(false);
                  }}
                >
                  <div>
                    <Label htmlFor="pkg-name" className="text-[13px]">Package Name</Label>
                    <Input
                      id="pkg-name"
                      placeholder="e.g. lodash, @tanstack/react-query"
                      className="mt-1.5 text-[13px] h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pkg-version" className="text-[13px]">Version (optional)</Label>
                    <Input
                      id="pkg-version"
                      placeholder="e.g. ^4.17.0"
                      className="mt-1.5 text-[13px] h-9"
                    />
                  </div>
                  <Button type="submit" className="w-full text-[13px] h-9">
                    Start Monitoring
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8.5 h-8 max-w-xs text-[13px] bg-muted/30 border-transparent"
        />
      </div>

      <Card className="border-border/40">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground/60">Package</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground/60">Current</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground/60">Safe Version</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground/60">Status</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground/60">Last Alert</th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground/60"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className={cn(
                      "transition-colors hover:bg-muted/20",
                      pkg.muted && "opacity-40"
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <a
                          href={`https://www.npmjs.com/package/${pkg.packageName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] font-mono font-medium hover:text-foreground/70 hover:underline transition-colors"
                        >
                          {pkg.packageName}
                        </a>
                        {pkg.muted && (
                          <VolumeX className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <code className="text-[12px] font-mono text-muted-foreground">
                        {pkg.currentVersion || "—"}
                      </code>
                    </td>
                    <td className="px-4 py-2.5">
                      <code className={cn(
                        "text-[12px] font-mono",
                        pkg.currentVersion !== pkg.latestSafeVersion
                          ? "text-[var(--success)] font-medium"
                          : "text-muted-foreground"
                      )}>
                        {pkg.latestSafeVersion || "—"}
                      </code>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={pkg.status} />
                    </td>
                    <td className="px-4 py-2.5 text-[11px]">
                      {pkg.lastAlertAt ? <TimeAgo date={pkg.lastAlertAt} /> : <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-[13px]" onClick={() => window.open(`https://www.npmjs.com/package/${pkg.packageName}`, "_blank")}>
                            <ExternalLink className="mr-2 h-3.5 w-3.5" />
                            View on npm
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[13px]" onClick={() => handleToggleMute(pkg.id)}>
                            <VolumeX className="mr-2 h-3.5 w-3.5" />
                            {pkg.muted ? "Unmute" : "Mute"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive text-[13px]"
                            onClick={() => handleRemove(pkg.id)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <Package className="mb-3 h-8 w-8 text-muted-foreground/30" />
              <p className="text-[13px] font-medium">No packages found</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {search ? "Try a different search term." : "Add a package or upload package.json to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
