// src/app/(dashboard)/github-prs/components/github-prs-widget.tsx
import { useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { siGithub } from "simple-icons";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
// Removed Icon import as we are using an inline SVG for now, but we will create a generic Icon component later
// import { Icon } from "@/components/ui/icon";

// Define types for GitHub PR data
type GithubPullRequest = {
  id: number;
  title: string;
  user: {
    avatar_url: string;
    login: string;
  };
  html_url: string;
  created_at: string; // In ISO format
  state: string; // e.g., "open", "closed"
  merged: boolean | null;
  body: string | null; // Description of the PR
};

// Placeholder for the icon component to render simple-icons
const GitHubIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill={siGithub.hex} // Use siGithub
  >
    <title>{siGithub.title}</title> // Use siGithub
    <path d={siGithub.path} /> // Use siGithub
  </svg>
);

// Define the props interface for the widget
type GithubPrsWidgetProps = {
  userId: string | null; // Expect userId as a prop
  userInfo: { github_username: string | null } | null; // Expect user info as a prop
};

// Updated component to accept props
export function GithubPrsWidget({ userId, userInfo }: GithubPrsWidgetProps) {
  // Removed userId and setUserInfo state, and related searchParams logic
  // const searchParams = useSearchParams();
  // const userId = searchParams.get("userId");

  const [pullRequests, setPullRequests] = useState<GithubPullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPrId, setExpandedPrId] = useState<number | null>(null);

  const supabase = createSupabaseClient();

  // fetchUserData is no longer needed here as user info is passed as a prop.
  // We only need to fetch the PRs based on the provided username.

  const fetchGitHubPullRequests = useCallback(
    async (username: string | null) => {
      if (!username) {
        // If username is null or empty, clear PRs and stop loading
        setPullRequests([]);
        setLoading(false);
        setError(null); // Clear any previous errors
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.github.com/search/issues?q=is:pr+repo:robertplaut/echostatus+author:${username}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`GitHub API error for ${username}:`, errorData);
          // Specific error message for no username found or bad request
          if (response.status === 404 || response.status === 422) {
            setError(`No GitHub username found or invalid API request.`);
            setPullRequests([]);
          } else {
            setError(
              `GitHub API error: ${errorData.message || response.statusText}`
            );
            setPullRequests([]);
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setPullRequests(data.items);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching GitHub pull requests:", err);
        setError("Failed to load GitHub pull requests.");
        setPullRequests([]);
        setLoading(false);
      }
    },
    [] // No dependencies needed here as we get username from props
  );

  // useEffect to fetch PRs when userId or userInfo.github_username changes
  useEffect(() => {
    // Only fetch if we have a valid userId and a github_username
    if (userId && userInfo?.github_username) {
      fetchGitHubPullRequests(userInfo.github_username);
    } else if (userId && !userInfo?.github_username) {
      // Handle case where user exists but has no GitHub username
      setError("User does not have a GitHub username configured.");
      setPullRequests([]);
      setLoading(false);
    } else {
      // If userId is null or not provided, no need to fetch
      setPullRequests([]);
      setLoading(false);
      setError("Please select a user."); // Set a default message if userId is missing
    }
  }, [userId, userInfo, fetchGitHubPullRequests]);

  const handleToggleExpand = useCallback((prId: number) => {
    setExpandedPrId((prevId) => (prevId === prId ? null : prId));
  }, []);

  // --- Rendering Logic ---

  // If userId is null or not provided, display a message
  if (!userId) {
    return (
      <div className="p-4">
        Please select a user from the dropdown to view their GitHub pull
        requests.
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className="space-y-4 p-4 border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-[200px]" />
          </div>
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <Separator />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-2 border-b last:border-b-0"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return <p className="p-4 text-destructive">{error}</p>;
  }

  // Render the actual content
  return (
    <div className="space-y-4 p-4 border rounded-lg shadow-sm w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <GitHubIcon />
          <h2 className="text-xl font-semibold ml-2">
            {userInfo?.github_username
              ? `${userInfo.github_username}`
              : "GitHub Pull Requests"}
          </h2>
        </div>
      </div>
      <Separator />

      {pullRequests.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No pull requests found for this user.
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-2">
          {pullRequests.map((pr) => (
            <div
              key={pr.id}
              className="mb-4 p-3 border rounded-md shadow-sm last:mb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={pr.user.avatar_url}
                    alt={`${pr.user.login}'s avatar`}
                    className="h-8 w-8 rounded-full"
                    loading="lazy"
                  />
                  <div className="flex flex-col">
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {pr.title}
                    </a>
                    <span className="text-xs text-muted-foreground">
                      by {pr.user.login} on{" "}
                      {/* Date format will be updated in the next step */}
                      {new Date(pr.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long", // 'long' for full month name (e.g., July)
                        day: "numeric", // 'numeric' for day (e.g., 31)
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-semibold ${
                      pr.state === "open"
                        ? "text-green-500"
                        : pr.state === "closed" && pr.merged
                        ? "text-purple-500"
                        : pr.state === "closed"
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    Status: {/* Added "Status: " here */}
                    {pr.state === "open"
                      ? "Open"
                      : pr.merged
                      ? "Merged"
                      : "Closed"}
                    {pr.state === "closed" && pr.merged && (
                      <span className="ml-1">✅</span>
                    )}
                  </span>
                  <button
                    onClick={() => handleToggleExpand(pr.id)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    {expandedPrId === pr.id ? "Hide Details" : "Show Details"}
                  </button>
                </div>
              </div>
              {expandedPrId === pr.id && ( // Removed the && pr.body here, we will handle it inside
                <div className="mt-3 p-3 bg-accent rounded-md text-sm">
                  {/* --- MODIFIED TO RENDER MARKDOWN OR A MESSAGE --- */}
                  {pr.body ? (
                    <ReactMarkdown>{pr.body}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No description available for this pull request.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
