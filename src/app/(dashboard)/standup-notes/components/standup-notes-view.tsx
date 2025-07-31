// file: src/app/(dashboard)/standup-notes/components/standup-notes-view.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { StandupForm } from "./standup-form";
import { PastNotesList } from "./past-notes-list";
import { Skeleton } from "@/components/ui/skeleton";

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

export function StandupNotesView() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [user, setUser] = useState<User | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const supabase = createSupabaseClient();
    const fetchFormData = async () => {
      const { data } = await supabase
        .from("notes")
        .select("yesterday_text, today_text, blockers_text, learnings_text")
        .eq("user_id", userId)
        .eq("date", selectedDate)
        .single();
      setNote(data);
    };

    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("display_name, role, team")
        .eq("id", userId)
        .single();
      if (error) {
        setError("Failed to load user data.");
      } else {
        setUser(data);
      }
      setLoading(false);
    };

    if (!user) {
      fetchUser();
    }
    fetchFormData();
  }, [userId, selectedDate, user]);

  const handleDateChange = useCallback((newDate: string) => {
    setSelectedDate(newDate);
  }, []);

  const handleNoteSaved = useCallback(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  if (!userId) {
    return (
      <div className="p-4">
        Please select a user from the dropdown to view their notes.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-destructive">{error}</p>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {user && (
        <div className="flex items-baseline gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {user.display_name}
          </h1>
          <p className="text-muted-foreground">
            {user.role} - {user.team}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-3">
          <StandupForm
            userId={userId}
            existingNote={note}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onNoteSaved={handleNoteSaved}
          />
        </div>
        <div className="lg:col-span-3">
          <PastNotesList userId={userId} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
