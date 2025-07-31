"use client";

import { useState, useEffect } from "react";
// We now use the hook here again.
import { useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { StandupForm } from "./standup-form";

type User = {
  display_name: string | null;
  role: string | null;
  team: string | null;
};

type Note = {
  yesterday_text: string | null;
  today_text: string | null;
  blockers_text: string | null;
  learnings_text: string | null;
};

// This component no longer accepts userId as a prop.
export function StandupNotesView() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [user, setUser] = useState<User | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This useEffect is now fully self-contained and handles all cases.
    if (!userId) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const supabase = createSupabaseClient();

    const fetchInitialData = async () => {
      setLoading(true);
      const [userResponse, noteResponse] = await Promise.all([
        supabase
          .from("users")
          .select("display_name, role, team")
          .eq("id", userId)
          .single(),
        supabase
          .from("notes")
          .select("yesterday_text, today_text, blockers_text, learnings_text")
          .eq("user_id", userId)
          .eq("date", today)
          .single(),
      ]);

      if (userResponse.error) {
        console.error("Client-side fetch error (user):", userResponse.error);
        setError("Failed to load user data.");
      } else {
        setUser(userResponse.data);
      }

      if (noteResponse.data) {
        setNote(noteResponse.data);
      } else {
        setNote(null);
      }

      setLoading(false);
    };

    fetchInitialData();
  }, [userId]);

  if (loading) {
    return <p className="p-4">Loading user information...</p>;
  }

  if (error) {
    return <p className="p-4 text-destructive">{error}</p>;
  }

  if (!userId || !user) {
    return (
      <div className="p-4">
        Please select a user from the dropdown to view their notes.
      </div>
    );
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-3">
          <StandupForm userId={userId} existingNote={note} />
        </div>
        <div className="lg:col-span-3">
          {/* Past Notes widget will go here */}
        </div>
      </div>
    </div>
  );
}
