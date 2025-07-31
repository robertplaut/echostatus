// file: src/components/nav-links.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Home, UserPlus, Users } from "lucide-react";

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "User List", href: "/users", icon: Users },
  { name: "Create User", href: "/users/create", icon: UserPlus },
];

export function NavLinks() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const constructHref = (baseHref: string) => {
    if (userId) {
      return `${baseHref}?userId=${userId}`;
    }
    return baseHref;
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={constructHref(link.href)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <LinkIcon className="h-4 w-4" />
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
