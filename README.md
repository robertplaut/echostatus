# Echostatus

A lightweight, modern dashboard for team members to view their GitHub pull requests and log daily summary notes. Built with the Next.js App Router, shadcn/ui, and Supabase.

---

## Project Overview

Echostatus is a responsive, single-page application designed to provide a centralized and streamlined view of a development team's status. The core purpose is to reduce the time spent in status meetings by allowing team members to asynchronously log their progress and view colleagues' updates and GitHub activity in a clean, intuitive interface.

All data is stored and synced in real-time via a Supabase backend. The application is designed to be easily deployable to Vercel.

## Core Features (Current)

- **User Management:**
  - **User List:** A responsive, card-based grid displaying all users, grouped by team and sorted alphabetically. Each card is a link to that user's "Standup Notes" page.
  - **Create User:** A dedicated form for creating new users with predefined dropdowns for 'Team' and 'Role' to ensure data consistency.
- **Dynamic Dashboard:**
  - **Dynamic Header:** The main header dynamically displays the title of the current page.
  - **"Login As" User Switcher:** A dropdown in the header allows for quickly switching the context of the dashboard to any user in the database. The selected user state is persisted across pages via URL query parameters.
  - **Conditional Navigation:** User-specific navigation links automatically appear in the sidebar only when a user is selected.
- **Standup Notes:**
  - A dedicated page for a selected user to log and view their standup notes.
  - **Dynamic Note Form:** A form that allows creating or editing notes for any selected date. It is pre-populated with any existing data for the selected day.
  - **Past Notes Widget:** A scrollable list that displays all of a user's previous notes, sorted by date, with alternating background colors for readability.
  - **Real-time Updates:** After saving a note, both the form and the past notes list update instantly with the latest data without a full page reload.
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
    - Copy the contents of `package.json.example` (if it exists) or simply create the file with the following content:

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

We use three distinct Supabase clients, physically separated to prevent build errors:

1.  **`src/lib/supabase/client.ts`:** Uses `createBrowserClient`. Exclusively for use in Client Components (`"use client"`).
2.  **`src/lib/supabase/server.ts`:** Uses the core `createClient`. For use in Server Components to fetch data without accessing cookies.
3.  **`src/lib/supabase/actions.ts`:** Uses `createServerClient` from `@supabase/ssr`. This client requires `cookies` and is exclusively for use in Server Actions that need authentication context.

### Server Actions

Form submissions are handled by [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).

- We use the `useActionState` hook to manage form state and handle server responses.
- After a successful data mutation, we call `router.refresh()` from the client to tell Next.js to re-fetch server-side data, ensuring the UI is up-to-date.

---

## Architectural Patterns for AI Collaboration

This section documents key architectural decisions and patterns established in the project. It serves as a guide for future development to ensure consistency.

### Pattern 1: Dynamic Pages with Client-Side Logic

- **Context:** Pages that depend heavily on URL parameters (`searchParams`) and require complex, interactive state management across multiple components (e.g., the Standup Notes page).
- **Pattern:**
  1.  The `page.tsx` file is a **minimal, static Server Component**. Its only job is to render a top-level Client Component within a `<Suspense>` boundary. It does not access `searchParams` or perform data fetching.
  2.  The top-level Client Component (e.g., `StandupNotesView`) is the "conductor." It is marked with `"use client"` and uses the `useSearchParams` hook to read the URL.
  3.  This conductor component manages all relevant state (`useState`) and fetches all necessary data for its children within a `useEffect` hook, using the client-side Supabase client.
  4.  It renders child components, passing down the necessary data and state-updating functions as props.
- **Rationale:** This pattern avoids a recurring and difficult-to-debug Next.js rendering error related to `searchParams` access in Server Components. It creates a clear boundary: the page route is static, but the content within is fully dynamic and controlled on the client.

### Pattern 2: Refreshing Data Across Sibling Components

- **Context:** After a form submission in one component (`StandupForm`), another sibling component (`PastNotesList`) needs to display the updated data.
- **Pattern:**
  1.  The parent "conductor" component (`StandupNotesView`) defines a piece of state called `refreshKey` (e.g., `const [refreshKey, setRefreshKey] = useState(0)`).
  2.  It passes the `refreshKey` down as a prop to the component that needs to be refreshed (`<PastNotesList refreshKey={refreshKey} />`).
  3.  It passes a callback function down to the component that triggers the change (`<StandupForm onNoteSaved={handleNoteSaved} />`).
  4.  The `handleNoteSaved` callback simply increments the `refreshKey`: `setRefreshKey(k => k + 1)`.
  5.  The `PastNotesList` component has a `useEffect` hook that includes `refreshKey` in its dependency array. When the key changes, the effect re-runs, and the component re-fetches its data.
- **Rationale:** This is a clean, effective way to communicate between sibling components via their parent without using `router.refresh()` or more complex state management libraries.

### Pattern 3: Controlled Components for Forms

- **Context:** Forms that need to be pre-populated with data from the server and reflect updates immediately.
- **Pattern:**
  1.  Form input values (e.g., for a `<Textarea>`) are held in local `useState`.
  2.  The state is initialized from props passed down from the parent: `useState(props.existingNote?.yesterday_text ?? "")`. The nullish coalescing operator (`?? ""`) is crucial to prevent "uncontrolled to controlled" errors.
  3.  A `useEffect` hook syncs the local state if the incoming prop changes: `useEffect(() => { setText(props.existingNote?.yesterday_text ?? "") }, [props.existingNote]);`.
  4.  The input element uses the `value` and `onChange` props to bind it to the local state.
- **Rationale:** This pattern gives React full control over the form's state, preventing bugs where the UI becomes out of sync with the application's data after a save or refresh.

---

## Future Roadmap

- Build the "GitHub PRs" page and widget.
- Build the "Edit Profile" page and form.
- Build the "Summary" page and form.
- Build the "AI Summary" widget.
- Implement a tour/tutorial feature.
- Implement full user authentication (e.g., login with Okta).
