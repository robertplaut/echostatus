import { createSupabaseServerClientReadOnly } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StandupForm } from "./standup-form";

interface StandupNotesContentProps {
  userId: string;
}

export async function StandupNotesContent({
  userId,
}: StandupNotesContentProps) {
  const supabase = createSupabaseServerClientReadOnly();
  const { data: user, error } = await supabase
    .from("users")
    .select("display_name, role, team")
    .eq("id", userId)
    .single();

  if (error || !user) {
    console.error("Failed to fetch user for standup page", error);
    redirect("/users");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {user.display_name}!
        </h1>
        <p className="text-muted-foreground">
          {user.role} - {user.team}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <StandupForm userId={userId} />
        </div>
        <div className="lg:col-span-3">
          {/* Past Notes widget will go here */}
        </div>
      </div>
    </div>
  );
}
