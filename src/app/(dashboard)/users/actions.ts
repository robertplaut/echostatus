// file: src/app/(dashboard)/users/actions.ts
"use server";

import { createSupabaseServerClientReadOnly } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData) {
  // Use the read-only client to avoid cookie-related errors for this public action
  const supabase = createSupabaseServerClientReadOnly();

  const githubUsername = formData.get("github-username") as string;

  const userData = {
    display_name: formData.get("display-name") as string,
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    team: formData.get("team") as string,
    role: formData.get("role") as string,
    // FIX: Only set github_username if it's not an empty string, otherwise it will be null
    github_username: githubUsername || null,
  };

  const { error } = await supabase.from("users").insert([userData]);

  if (error) {
    console.error("Error creating user:", error.message);
    // In a real app, you'd want to return this error to the UI
    // For now, we'll just log it and stop.
    return {
      error: {
        message: error.message,
      },
    };
  }

  // Revalidate the users page to show the new user
  revalidatePath("/users");

  // Redirect to the user list page
  redirect("/users");
}
