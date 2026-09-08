'use server'

import { supabaseAdmin } from '../../services/supabase/admin';

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    throw new Error('Missing required fields');
  }

  console.log('📝 Processing contact form submission for:', email);

  try {
    const { error } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'new'
      });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to save message');
    }

    // Log to server console
    console.log('----------------------------------------');
    console.log('📝 New Contact Form Submission Saved');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('----------------------------------------');

    return { success: true };
  } catch (error) {
    console.error('Contact form error:', error);
    throw new Error('Internal server error');
  }
}
