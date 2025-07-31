// file: src/app/(dashboard)/standup-notes/components/past-notes-list.tsx
"use client";

import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface PastNotesListProps {
  userId: string;
  refreshKey: number;
}

type Note = {
  date: string;
  yesterday_text: string | null;
  today_text: string | null;
  blockers_text: string | null;
  learnings_text: string | null;
};

export function PastNotesList({ userId, refreshKey }: PastNotesListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastNotes = async () => {
      setLoading(true);
      const supabase = createSupabaseClient();
      const { data, error } = await supabase
        .from("notes")
        .select(
          "date, yesterday_text, today_text, blockers_text, learnings_text"
        )
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching past notes:", error);
      } else {
        setNotes(data || []);
      }
      setLoading(false);
    };

    if (userId) {
      fetchPastNotes();
    }
  }, [userId, refreshKey]);

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 bg-muted/50 border-b">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 bg-muted/50 border-b">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Past Notes
        </h3>
        <p className="text-sm text-muted-foreground">
          A history of your previous standup notes.
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
          {notes.length === 0 ? (
            <p className="text-muted-foreground">No past notes found.</p>
          ) : (
            notes.map((note, index) => (
              <div key={note.date} className="p-4 rounded-md even:bg-muted/50">
                <h3 className="font-semibold text-lg">
                  {new Date(note.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </h3>
                <div className="pl-4 text-sm space-y-2 mt-2">
                  {note.yesterday_text && (
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Yesterday:
                      </p>
                      <p className="whitespace-pre-wrap">
                        {note.yesterday_text}
                      </p>
                    </div>
                  )}
                  {note.today_text && (
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Today:
                      </p>
                      <p className="whitespace-pre-wrap">{note.today_text}</p>
                    </div>
                  )}
                  {note.blockers_text && (
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Blocker(s):
                      </p>
                      <p className="whitespace-pre-wrap">
                        {note.blockers_text}
                      </p>
                    </div>
                  )}
                  {note.learnings_text && (
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Learning(s):
                      </p>
                      <p className="whitespace-pre-wrap">
                        {note.learnings_text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
