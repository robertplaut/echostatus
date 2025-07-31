// src/app/(dashboard)/github-prs/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // Added hooks
import { useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GithubPrsWidget } from "./components/github-prs-widget";

// Define types for user info we'll fetch
type UserInfo = {
  github_username: string | null;
};

export default function GithubPrsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); // Loading state for user data
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseClient();

  const fetchUserData = useCallback(
    async (currentUserId: string) => {
      setLoadingUser(true);
      setError(null); // Clear previous errors
      const { data, error } = await supabase
        .from("users")
        .select("github_username")
        .eq("id", currentUserId)
        .single();

      if (error) {
        console.error("Error fetching user data for GitHub PRs page:", error);
        setError("Failed to load user profile. Please select a user.");
        setUserInfo(null); // Ensure userInfo is null on error
      } else {
        setUserInfo(data);
      }
      setLoadingUser(false);
    },
    [supabase]
  );

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    } else {
      setLoadingUser(false); // Not loading if no userId
      setError(
        "Please select a user from the dropdown to view their GitHub pull requests."
      );
    }
  }, [userId, fetchUserData]);

  // Render loading or error states here
  if (!userId || loadingUser) {
    return (
      <div className="p-4">
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              GitHub Pull Requests
            </h1>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-64 w-full" /> {/* Skeleton for the widget */}
          </div>
        )}
      </div>
    );
  }

  // Render the widget, passing down fetched data
  return (
    <div className="p-4 sm:px-6 sm:py-0 md:gap-8">
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        GitHub Pull Requests
      </h1>
      {/* Pass userId and userInfo to the widget */}
      <GithubPrsWidget userId={userId} userInfo={userInfo} />
    </div>
  );
}
