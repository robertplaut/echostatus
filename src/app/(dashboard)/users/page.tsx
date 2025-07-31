// file: src/app/(dashboard)/users/page.tsx
import { createSupabaseServerClientReadOnly } from "@/lib/supabase/server";

export default async function UserListPage() {
  const supabase = createSupabaseServerClientReadOnly();
  const { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h2 className="text-3xl font-bold tracking-tight">User List</h2>
          <p className="mt-2 text-muted-foreground">
            A list of all users fetched from the Supabase database.
          </p>
          <div className="mt-4">
            {users && users.length > 0 ? (
              <ul>
                {users.map((user) => (
                  <li key={user.id}>{user.display_name || "No Name"}</li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
