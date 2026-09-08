'use server'

import { supabaseAdmin } from '../../services/supabase/admin';

export async function subscribeToNewsletter(email: string) {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email' };
  }

  try {
    const { error } = await supabaseAdmin
      .from('subscribers')
      .insert({ email });

    if (error) {
      if (error.code === '23505') { // Unique violation
         return { success: true, message: 'Already subscribed' };
      }
      console.error('Newsletter error:', error);
      return { success: false, error: 'Failed to subscribe' };
    }

    return { success: true };
  } catch (error) {
    console.error('Newsletter error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
