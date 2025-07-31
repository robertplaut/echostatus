// file: src/components/user-switcher.tsx
"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseClient } from "@/lib/supabase/client";

type User = {
  id: string;
  display_name: string | null;
};

export function UserSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  // Effect to fetch the list of users on component mount
  React.useEffect(() => {
    const supabase = createSupabaseClient();
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, display_name")
        .order("display_name");
      if (error) {
        console.error("Error fetching users for switcher:", error);
      } else {
        setUsers(data || []);
      }
    };
    fetchUsers();
  }, []);

  // Effect to set the selected user based on the URL query param
  React.useEffect(() => {
    const currentUserId = searchParams.get("userId");
    if (currentUserId && users.length > 0) {
      const user = users.find((u) => u.id === currentUserId);
      setSelectedUser(user || null);
    } else {
      setSelectedUser(null);
    }
  }, [searchParams, users]);

  const handleUserSelect = (userId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("userId", userId);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[220px] justify-between">
          {selectedUser ? selectedUser.display_name : "Login As..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[220px]">
        {users.map((user) => (
          <DropdownMenuItem
            key={user.id}
            onSelect={() => handleUserSelect(user.id)}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
              )}
            />
            {user.display_name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
