// file: src/app/(dashboard)/users/create/page.tsx
export default function CreateUserPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h2 className="text-3xl font-bold tracking-tight">Create User</h2>
          <p className="mt-2 text-muted-foreground">
            A form to create a new user will be displayed here.
          </p>
        </div>
      </div>
    </main>
  );
}
