// file: src/app/(dashboard)/standup-notes/page.tsx
import { Suspense } from "react";
import { StandupNotesView } from "./components/standup-notes-view";

// This page is now a completely static shell. It knows nothing about searchParams.
export default function StandupNotesPage() {
  return (
    <Suspense fallback={<p className="p-4">Loading page...</p>}>
      <StandupNotesView />
    </Suspense>
  );
}
