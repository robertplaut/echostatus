// file: src/components/user-card.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type User = {
  id: string;
  display_name: string | null;
  username: string;
  team: string;
  role: string;
};

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const avatarUrl = `https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}`;

  return (
    // Apply h-full to the Card component to make it stretch to the grid item height
    <Card className="h-full flex flex-col">
      {" "}
      {/* flex flex-col helps manage internal layout */}
      <CardHeader className="h-full flex items-center gap-4">
        {" "}
        {/* Ensure header also stretches */}
        <div className="flex items-center gap-4 w-full">
          {" "}
          {/* Added w-full to ensure children use available space */}
          <Avatar>
            <AvatarImage
              src={avatarUrl}
              alt={user.display_name || user.username}
            />
            <AvatarFallback>
              {user.display_name?.charAt(0) || user.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {" "}
            {/* flex-1 to take remaining space, min-w-0 for text overflow */}
            <CardTitle>{user.display_name || "Unnamed User"}</CardTitle>
            {/* Limit the height of the description and handle overflow */}
            <CardDescription className="block overflow-hidden text-ellipsis whitespace-nowrap">
              {" "}
              {/* Added classes to handle potential overflow */}
              {user.role}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {/* We don't have CardContent being used for critical data yet, but if we did,
          it would also need to be managed for height. For now, the header controls most of it. */}
    </Card>
  );
}
