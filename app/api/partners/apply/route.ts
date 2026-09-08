import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../services/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, platform, handle, customRef } = body;

    // Basic validation
    if (!name || !email || !platform || !handle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Check if user already exists by email
    const { data: existingUser } = await supabaseAdmin
      .from('partners')
      .select('ref_code, name')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({
        success: true,
        refCode: existingUser.ref_code,
        message: `Welcome back, ${existingUser.name}! We retrieved your existing link.`,
        isExisting: true
      });
    }

    // 2. Prepare new application
    // Determine ref_code
    let refCode = customRef 
      ? customRef.trim() 
      : handle.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // Ensure refCode is URL safe and not empty
    refCode = refCode.replace(/[^a-zA-Z0-9-_]/g, '');
    if (!refCode) {
      return NextResponse.json(
        { error: 'Invalid reference code generated' },
        { status: 400 }
      );
    }

    // 3. Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('partners')
      .insert({
        name,
        email,
        platform,
        handle,
        ref_code: refCode,
        status: 'active' // Auto-approve
      })
      .select()
      .single();

    if (error) {
      // Check for unique constraint violation on ref_code
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This referral code is already taken. Please choose another one.' },
          { status: 409 }
        );
      }
      
      console.error('Partner application error:', error);
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      refCode: data.ref_code,
      message: 'Application approved instantly!' 
    });

  } catch (e) {
    console.error('Partner API error:', e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
