// file: src/app/(dashboard)/standup-notes/actions.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type FormState = {
  error: { message: string } | null;
  success: boolean;
};

export async function saveNote(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = createSupabaseServerClient();

  const yesterdayText = formData.get("yesterday_text") as string;
  const todayText = formData.get("today_text") as string;
  const blockersText = formData.get("blockers_text") as string;
  const learningsText = formData.get("learnings_text") as string;

  if (!yesterdayText && !todayText && !blockersText && !learningsText) {
    return {
      error: { message: "At least one field must be filled to save the note." },
      success: false,
    };
  }

  const noteData = {
    user_id: formData.get("user_id") as string,
    date: formData.get("date") as string,
    yesterday_text: yesterdayText,
    today_text: todayText,
    blockers_text: blockersText,
    learnings_text: learningsText,
  };

  const { error } = await supabase
    .from("notes")
    .upsert(noteData, { onConflict: "user_id,date" });

  if (error) {
    console.error("Error saving note:", error);
    return { error: { message: error.message }, success: false };
  }

  revalidatePath("/standup-notes");

  return { success: true, error: null };
}
