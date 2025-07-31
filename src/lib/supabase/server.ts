// file: src/lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

// This client is for server-side fetching of public data in Server Components.
// It does not use cookies and is safe to be imported by any server component.
export function createSupabaseServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
