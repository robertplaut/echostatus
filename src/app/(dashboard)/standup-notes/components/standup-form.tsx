// file: src/app/(dashboard)/standup-notes/components/standup-form.tsx
"use client";

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { saveNote } from "@/app/(dashboard)/standup-notes/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Note = {
  yesterday_text: string | null;
  today_text: string | null;
  blockers_text: string | null;
  learnings_text: string | null;
};

interface StandupFormProps {
  userId: string;
  existingNote: Note | null;
  selectedDate: string;
  onDateChange: (newDate: string) => void;
  onNoteSaved: () => void;
}

const initialState = {
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save Note"}
    </Button>
  );
}

export function StandupForm({
  userId,
  existingNote,
  selectedDate,
  onDateChange,
  onNoteSaved,
}: StandupFormProps) {
  const [state, formAction] = useActionState(saveNote, initialState);

  const [yesterday, setYesterday] = useState(
    existingNote?.yesterday_text ?? ""
  );
  const [todayText, setTodayText] = useState(existingNote?.today_text ?? "");
  const [blockers, setBlockers] = useState(existingNote?.blockers_text ?? "");
  const [learnings, setLearnings] = useState(
    existingNote?.learnings_text ?? ""
  );

  useEffect(() => {
    setYesterday(existingNote?.yesterday_text ?? "");
    setTodayText(existingNote?.today_text ?? "");
    setBlockers(existingNote?.blockers_text ?? "");
    setLearnings(existingNote?.learnings_text ?? "");
  }, [existingNote]);

  useEffect(() => {
    if (state.success) {
      toast.success("Success!", {
        description: "Your standup note has been saved.",
      });
      onNoteSaved();
    } else if (state.error) {
      toast.error("Error", {
        description: state.error.message,
      });
    }
  }, [state, onNoteSaved]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 bg-muted/50 border-b">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Daily Standup Note
        </h3>
        <p className="text-sm text-muted-foreground">
          All fields are optional, but at least one must be used to save.
        </p>
      </div>
      <div className="p-6 pt-4">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="user_id" value={userId} />
          <input type="hidden" name="date" value={selectedDate} />
          <div className="space-y-2">
            <Label htmlFor="date-display">Date</Label>
            <Input
              id="date-display"
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yesterday">
              What did you accomplish yesterday?
            </Label>
            <Textarea
              id="yesterday"
              name="yesterday_text"
              placeholder="Completed the user authentication flow..."
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="today">What are you working on today?</Label>
            <Textarea
              id="today"
              name="today_text"
              placeholder="Start work on the dashboard widgets..."
              value={todayText}
              onChange={(e) => setTodayText(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blockers">Do you have any blockers?</Label>
            <Textarea
              id="blockers"
              name="blockers_text"
              placeholder="Waiting on API keys for the new integration..."
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="learnings">Learnings / Other Notes</Label>
            <Textarea
              id="learnings"
              name="learnings_text"
              placeholder="Learned about the new `structuredClone` API..."
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
