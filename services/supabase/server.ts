import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { DEV_SKIP_AUTH, createDevClient } from "./devStub";

export async function createClient() {
  // Local development only; see services/supabase/devStub.ts.
  if (DEV_SKIP_AUTH) return createDevClient();

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
