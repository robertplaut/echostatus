// file: src/app/(dashboard)/layout.tsx
import React, { Suspense } from "react";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-primary"
            >
              <span className="text-xl font-bold">Echostatus</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Suspense fallback={<div>Loading links...</div>}>
                <NavLinks />
              </Suspense>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <DashboardHeader />
        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
