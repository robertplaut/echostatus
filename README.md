# Echostatus

A lightweight, modern dashboard for team members to view their GitHub pull requests and log daily summary notes. Built with the Next.js App Router, shadcn/ui, and Supabase.

---

## Project Overview

Echostatus is a responsive, single-page application designed to provide a centralized and streamlined view of a development team's status. The core purpose is to reduce the time spent in status meetings by allowing team members to asynchronously log their progress and view colleagues' updates and GitHub activity in a clean, intuitive interface.

All data is stored and synced in real-time via a Supabase backend. The application is designed to be easily deployable to Vercel.

## Core Features (Current)

- **User Management:**
  - **User List:** A responsive, card-based grid displaying all users, grouped by team and sorted alphabetically. Each card shows the user's DiceBear-generated avatar, display name, and role.
  - **Create User:** A dedicated form for creating new users with predefined dropdowns for 'Team' and 'Role' to ensure data consistency.
- **Dynamic Dashboard:**
  - **"Login As" User Switcher:** A dropdown in the header allows for quickly switching the context of the dashboard to any user in the database. The selected user state is persisted across pages via URL query parameters.
  - **Conditional Navigation:** User-specific navigation links (like "Standup Notes") automatically appear in the sidebar only when a user is selected.
- **Standup Notes:**
  - A dedicated page for a selected user to log their daily standup notes.
  - The form includes fields for yesterday's accomplishments, today's tasks, blockers, and other learnings.
  - The form intelligently "upserts" data, allowing a user to create a new note or update an existing note for the current day seamlessly.
  - The form is pre-populated with any existing data for the current day, allowing for easy edits.
- **Modern UI/UX:**
  - Built with the clean and accessible **shadcn/ui** component library.
  - Includes a **Light/Dark Mode** theme toggle.
  - Features a fully responsive layout that adapts from mobile to desktop screens.
  - Interactive elements provide user feedback, such as hover effects and toast notifications for form submissions.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Database & Backend:** [Supabase](https://supabase.com/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Avatars:** [DiceBear](https://www.dicebear.com/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

---

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Git](https://git-scm.com/)
- A Supabase account with a project created.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/robertplaut/echostatus.git
    cd echostatus
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    - Create a new file named `.env.local` in the root of the project.
    - Find your API keys in your Supabase project dashboard under `Settings > API`.
    - Copy the contents of `.env.example` into `.env.local` and fill in your credentials:

    ```
    # .env.local

    # Supabase Credentials
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

    > **Note:** The `.env.local` file is included in `.gitignore` and should never be committed to the repository.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

---

## Project Architecture & Key Concepts

This project follows modern best practices for building applications with the Next.js App Router.

### Directory Structure

- **`src/app/(dashboard)`:** A [Route Group](https://nextjs.org/docs/app/building-your-application/routing/route-groups) is used to apply a shared layout (sidebar and header) to all dashboard pages without affecting the URL path.
- **`src/components/ui`:** Contains the un-styled UI components added from `shadcn/ui` (e.g., Button, Card). We own this code.
- **`src/components/`:** Contains our custom, application-specific components (e.g., `UserSwitcher`, `NavLinks`).
- **`src/lib/`:** Contains helper functions and utility code, such as the Supabase client initializers.

### State Management

The primary method of state management is URL-based, leveraging **URL Query Parameters**. The currently selected user is stored as `?userId=<uuid>`.

- **Benefits:** This makes the application state shareable, bookmarkable, and resilient to page reloads. It aligns perfectly with the server-centric model of the App Router.
- **Implementation:** The `UserSwitcher` component writes to the URL, and the `NavLinks` and page components read from it to persist the state across navigations.

### Data Fetching

We use two distinct Supabase clients, defined in `src/lib/supabase/server.ts`:

1.  **`createSupabaseServerClientReadOnly()`:** A lightweight client using the core `@supabase/supabase-js` library. It does not access cookies and is used for fetching public data in Server Components.
2.  **`createSupabaseServerClient()`:** An auth-aware client using `@supabase/ssr`. This client is designed to handle user sessions via cookies and will be used for protected actions and pages once full authentication is implemented.

### Server Actions

Form submissions and data mutations are handled by [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations). This allows us to write secure, server-side code that can be called directly from our client components.

- We use the `useActionState` hook (formerly `useFormState`) to manage form state and handle responses from the server (success/error messages).
- For actions that modify data, we use `revalidatePath()` to purge the server-side cache and `router.refresh()` to update the client UI with the new data.

---

## Challenges & Solutions

During development, we encountered several significant technical challenges. Documenting them provides insight into the final architecture.

### 1. The Stubborn `searchParams` Rendering Error

- **Problem:** On dynamic pages that read URL parameters (like `/standup-notes`), Next.js repeatedly threw the error: `Route used searchParams.userId. searchParams should be awaited before using its properties.`
- **Investigation:** This error persisted despite using the documented and correct syntax for accessing `searchParams` in a Server Component page. We attempted several fixes, including `export const dynamic = "force-dynamic"`, clearing the `.next` cache, and refactoring the prop-passing chain. None of these fully resolved the issue, indicating a deep, intermittent bug in the framework's rendering lifecycle for this specific use case.
- **Solution:** We adopted a more robust architectural pattern. The `page.tsx` file was simplified into a **completely static shell** that renders a top-level **Client Component** (`StandupNotesView`) inside a `<Suspense>` boundary. This new component is then solely responsible for all dynamic logic: using the `useSearchParams` hook to read the URL, and `useEffect` to fetch data on the client side. This cleanly separates the static page route from the dynamic content, sidestepping the rendering bug entirely.

### 2. Stale Form State After Updates

- **Problem:** After successfully updating the Standup Note form, a success toast would appear, but the text areas on the form would revert to showing the old data, not the newly saved data. The new data would only appear after a full page navigation.
- **Investigation:** This was caused by a classic React state issue. Calling `router.refresh()` correctly told the server to re-fetch the data and send it down, but the `StandupForm` client component, which used `defaultValue`, did not automatically update its internal DOM state from the new props.
- **Solution:** We converted the form from using "uncontrolled" components (`defaultValue`) to **"controlled" components**.
  1.  The `StandupForm` now holds the value of each text area in its own `useState`.
  2.  The `<Textarea>` components use the `value` and `onChange` props to bind them to this state.
  3.  A `useEffect` hook was added to explicitly listen for changes to the `existingNote` prop. When this prop changes (after `router.refresh()` completes), the effect fires and programmatically updates the local `useState` with the new data from the server, ensuring the UI is always in sync.

### 3. Supabase `upsert` Constraint Violation

- **Problem:** When saving a Standup Note for a second time on the same day, the database threw a `duplicate key value violates unique constraint "unique_user_date"` error.
- **Investigation:** The `upsert` command was behaving like a simple `insert`. The Supabase client requires explicit instructions on which constraint to use for conflict resolution.
- **Solution:** We provided the `onConflict` option to the `upsert` call: `.upsert(noteData, { onConflict: 'user_id,date' })`. This tells Supabase to check for conflicts on the `(user_id, date)` combination and perform an update if one is found, resolving the issue.

---

## Future Roadmap

- Implement the "Past Notes" widget on the Standup Notes page.
- Build the "GitHub PRs" page and widget.
- Build the "Edit Profile" page and form.
- Implement the custom-built tour feature.
- Implement full user authentication (e.g., login with GitHub).
