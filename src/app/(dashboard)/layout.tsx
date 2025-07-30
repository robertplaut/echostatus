// file: src/app/(dashboard)/layout.tsx
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <h1 className="text-2xl font-bold text-primary">Echostatus</h1>
          {/* Sidebar navigation links will go here */}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="font-semibold">
            {/* Page title will go here */}
            Home
          </div>
          <div>{/* Header right-side controls will go here */}</div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
