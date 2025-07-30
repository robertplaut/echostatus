// src/app/(dashboard)/page.tsx
export default function Home() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to Echostatus
          </h2>
          <p className="mt-2 text-muted-foreground">
            This is a lightweight dashboard for team members to view their
            GitHub pull requests and log daily summary notes.
          </p>
        </div>
      </div>
    </main>
  );
}
