"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MOCK_PROJECTS } from "@/lib/constants";
import type { Project } from "@/types";

interface ProjectContextValue {
  project: Project;
  setProject: (project: Project) => void;
  projects: Project[];
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project>(MOCK_PROJECTS[0]);

  return (
    <ProjectContext value={{ project, setProject, projects: MOCK_PROJECTS }}>
      {children}
    </ProjectContext>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}
