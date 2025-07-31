// file: src/app/(dashboard)/standup-notes/page.tsx
import { Suspense } from "react";
import { StandupNotesView } from "./components/standup-notes-view";

export default function StandupNotesPage() {
  return (
    <Suspense fallback={<p className="p-4">Loading...</p>}>
      <StandupNotesView />
    </Suspense>
  );
}
