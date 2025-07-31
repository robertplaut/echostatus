// file: src/app/(dashboard)/standup-notes/components/standup-form.tsx
"use client";

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveNote } from "@/app/(dashboard)/standup-notes/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function StandupForm({ userId, existingNote }: StandupFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [state, formAction] = useActionState(saveNote, initialState);
  const router = useRouter();

  // Create local state for each form field, initialized by the prop
  const [yesterday, setYesterday] = useState(
    existingNote?.yesterday_text || ""
  );
  const [todayText, setTodayText] = useState(existingNote?.today_text || "");
  const [blockers, setBlockers] = useState(existingNote?.blockers_text || "");
  const [learnings, setLearnings] = useState(
    existingNote?.learnings_text || ""
  );

  // This effect SYNCS the local state if the server data changes
  useEffect(() => {
    setYesterday(existingNote?.yesterday_text || "");
    setTodayText(existingNote?.today_text || "");
    setBlockers(existingNote?.blockers_text || "");
    setLearnings(existingNote?.learnings_text || "");
  }, [existingNote]);

  useEffect(() => {
    if (state.success) {
      toast.success("Success!", {
        description: "Your standup note has been saved.",
      });
      router.refresh();
    } else if (state.error) {
      toast.error("Error", {
        description: state.error.message,
      });
    }
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Standup Note</CardTitle>
        <CardDescription>
          All fields are optional, but at least one must be used to save.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="user_id" value={userId} />
          <input type="hidden" name="date" value={today} />

          <div className="space-y-2">
            <Label htmlFor="date-display">Date</Label>
            <Input
              id="date-display"
              type="date"
              defaultValue={today}
              disabled
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
      </CardContent>
    </Card>
  );
}
