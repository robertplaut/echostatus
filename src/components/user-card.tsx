// file: src/components/user-card.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define a type for our user object for better type safety
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
  // DiceBear provides free, fun, and unique avatars based on a seed string.
  // We'll use the user's unique username as the seed.
  const avatarUrl = `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.username}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={avatarUrl}
              alt={user.display_name || user.username}
            />
            <AvatarFallback>
              {user.display_name?.charAt(0) || user.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.display_name || "Unnamed User"}</CardTitle>
            <CardDescription>{user.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
