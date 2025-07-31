// file: src/lib/supabase/server.ts
import {
  createServerClient as _createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// This client is for server-side actions where you need to be logged in.
// It will be used for things like creating notes, updating profiles, etc.
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

// This client is for server-side fetching of public data in Server Components.
// It does not require cookies and is safe for read-only operations.
export function createSupabaseServerClientReadOnly() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // This is the key change
      auth: {
        persistSession: false,
      },
    }
  );
}
