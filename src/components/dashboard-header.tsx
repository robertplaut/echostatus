"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { UserSwitcher } from "@/components/user-switcher";

// A mapping from URL paths to friendly display names
const pathNameMap: { [key: string]: string } = {
  "/": "Home",
  "/users": "User List",
  "/users/create": "Create User",
  "/standup-notes": "Standup Notes",
  "/github-prs": "GitHub PRs",
  "/edit-profile": "Edit Profile",
};

export function DashboardHeader() {
  const pathname = usePathname();

  // Look up the friendly name, or default to the capitalized path
  const pageTitle =
    pathNameMap[pathname] ||
    pathname.split("/").pop()?.replace(/-/g, " ") ||
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="font-semibold capitalize">{pageTitle}</div>
      <div className="flex items-center gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <UserSwitcher />
        </Suspense>
        <ModeToggle />
      </div>
    </header>
  );
}
