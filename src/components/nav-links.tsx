// file: src/components/nav-links.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Home, UserPlus, Users, FileText, UserCog } from "lucide-react";
import { Separator } from "@/components/ui/separator"; // Ensure this import is present
import { siGithub } from "simple-icons"; // Corrected import

// Define a custom icon component for simple-icons
const GitHubIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill={siGithub.hex}
  >
    <title>{siGithub.title}</title>
    <path d={siGithub.path} />
  </svg>
);

const primaryLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "User List", href: "/users", icon: Users },
  { name: "Create User", href: "/users/create", icon: UserPlus },
];

const userLinks = [
  { name: "Standup Notes", href: "/standup-notes", icon: FileText },
  { name: "GitHub PRs", href: "/github-prs", icon: GitHubIcon }, // Use the new icon component
  { name: "Edit Profile", href: "/edit-profile", icon: UserCog },
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
      {primaryLinks.map((link) => {
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

      {userId && (
        <>
          <Separator className="my-2" /> {/* Separator is used here */}
          {userLinks.map((link) => {
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
      )}
    </>
  );
}
