'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../services/supabase/server'

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
