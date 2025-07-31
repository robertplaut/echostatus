// file: src/app/(dashboard)/users/page.tsx
import { createSupabaseServerClientReadOnly } from "@/lib/supabase/server";
import { UserCard, type User } from "@/components/user-card";

// Helper function to group users by team
function groupUsersByTeam(users: User[]): Record<string, User[]> {
  return users.reduce((acc, user) => {
    const team = user.team || "No Team";
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(user);
    return acc;
  }, {} as Record<string, User[]>);
}

export default async function UserListPage() {
  const supabase = createSupabaseServerClientReadOnly();
  const { data: users, error } = await supabase
    .from("users")
    .select("id, display_name, username, team, role")
    .order("team"); // Order by team to ensure consistent grouping

  if (error) {
    console.error("Error fetching users:", error);
    return (
      <main className="p-4 sm:px-6 sm:py-0">
        <p className="text-destructive">Error loading users.</p>
      </main>
    );
  }

  const groupedUsers = groupUsersByTeam(users || []);

  // Sort users within each team alphabetically by display_name
  for (const team in groupedUsers) {
    groupedUsers[team].sort((a, b) =>
      (a.display_name || "").localeCompare(b.display_name || "")
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {Object.entries(groupedUsers).map(([team, teamUsers]) => (
        <div key={team}>
          <h2 className="text-2xl font-bold tracking-tight capitalize mb-4">
            {team}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      ))}
      {users.length === 0 && <p>No users found. Create one!</p>}
    </main>
  );
}
