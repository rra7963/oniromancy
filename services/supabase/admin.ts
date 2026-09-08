import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Check both common env var names for service role key
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
}

if (!supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations will fail.');
}

// Create a Supabase client with the Service Role Key
// This client should ONLY be used in server-side contexts (API routes, Server Actions)
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceRoleKey || 'placeholder-key-for-build', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
