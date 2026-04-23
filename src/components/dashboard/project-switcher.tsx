"use client";

import { useState, useRef, useEffect } from "react";
import { useProject } from "@/lib/project-context";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, FolderKanban, Plus } from "lucide-react";
import type { Project } from "@/types";

export function ProjectSwitcher() {
  const { project, setProject, projects } = useProject();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  function select(p: Project) {
    setProject(p);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 transition-colors hover:bg-muted",
          open && "bg-muted"
        )}
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded text-white"
          style={{ backgroundColor: project.color }}
        >
          <FolderKanban className="h-2.5 w-2.5" strokeWidth={2} />
        </span>
        <span className="text-sm font-medium max-w-[120px] truncate">
          {project.name}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.8} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-[220px] rounded-lg border border-border bg-popover p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="px-2 py-1.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Projects
            </p>
          </div>
          <div className="space-y-0.5">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => select(p)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors",
                  p.id === project.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-white"
                  style={{ backgroundColor: p.color }}
                >
                  <FolderKanban className="h-2.5 w-2.5" strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.packagesCount} packages
                    {p.alertsCount > 0 && (
                      <span className="text-[var(--severity-high)]"> · {p.alertsCount} alerts</span>
                    )}
                  </p>
                </div>
                {p.id === project.id && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-foreground" strokeWidth={2} />
                )}
              </button>
            ))}
          </div>
          <div className="mt-1 border-t border-border pt-1">
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
              New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
