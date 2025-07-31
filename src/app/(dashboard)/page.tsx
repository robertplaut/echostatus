// src/app/(dashboard)/page.tsx
export default function Home() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome to Echostatus
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Echostatus is your team's central hub for staying updated.
            Effortlessly track your progress and stay informed about your
            colleagues' work.
          </p>
          <div className="mt-6 space-y-4">
            {/* Feature: User List */}
            <div>
              <h3 className="text-xl font-semibold mb-1">Discover Your Team</h3>
              <p className="text-muted-foreground">
                Browse all team members in a clear, responsive grid. Each user
                card shows their role and team, providing a quick overview.
              </p>
            </div>
            {/* Feature: Standup Notes */}
            <div>
              <h3 className="text-xl font-semibold mb-1">
                Log Your Daily Standups
              </h3>
              <p className="text-muted-foreground">
                Easily record your daily progress, tasks completed, and any
                blockers. View your past notes sorted chronologically.
              </p>
            </div>
            {/* Feature: GitHub Pull Requests */}
            <div>
              <h3 className="text-xl font-semibold mb-1">
                Track GitHub Activity
              </h3>
              <p className="text-muted-foreground">
                See your recent GitHub pull requests directly within the app,
                complete with details, status, and descriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
