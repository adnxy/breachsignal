"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { ProjectProvider } from "@/lib/project-context";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProjectProvider>
      <div className="flex min-h-screen bg-background antialiased">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex flex-1 flex-col lg:pl-[220px]">
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1120px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}
