'use server'

import { createClient as createServerClient } from '@/services/supabase/server'
import { supabaseAdmin } from '@/services/supabase/admin'
import { REFERRAL_BONUS } from '@/types'

export async function processReferralAction(inviteeId: string, inviterId: string) {
  if (!inviterId || !inviteeId || inviterId === inviteeId) {
    return { success: false, error: 'Invalid referral' }
  }

  try {
    // 1. Check if inviter exists
    const { data: inviter } = await supabaseAdmin
      .from('profiles')
      .select('id, credits')
      .eq('id', inviterId)
      .single()

    if (!inviter) {
      return { success: false, error: 'Inviter not found' }
    }

    // 2. Check if referral already exists (prevent double dipping)
    const { data: existing } = await supabaseAdmin
      .from('referrals')
      .select('id')
      .eq('invitee_id', inviteeId)
      .single()

    if (existing) {
      return { success: false, error: 'Referral already processed' }
    }

    // 3. Verify Invitee is a New User (created within last 24 hours)
    // This prevents old users from clicking links to get free credits
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(inviteeId)
    
    if (userError || !userData?.user) {
        // Fail closed: if we can't verify the user, we don't process the referral
        console.error('Could not verify user creation time:', userError)
        return { success: false, error: 'User verification failed' }
    } else {
        const created = new Date(userData.user.created_at)
        const now = new Date()
        const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
        
        if (diffHours > 24) {
            return { success: false, error: 'User not eligible (account too old)' }
        }
    }

    // 3.5. Ensure Invitee Profile Exists (with Retry)
    // Sometimes the auth trigger or client-side profile creation lags behind this call
    let profileExists = false;
    // Increased retries to 10 and delay to 800ms to be safer (total ~8s)
    for (let attempt = 0; attempt < 10; attempt++) {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', inviteeId)
            .single();
        
        if (data && !error) {
            profileExists = true;
            break;
        }
        console.log(`[ReferralAction] Profile ${inviteeId} not ready. Retry ${attempt + 1}/10...`);
        // Wait 800ms before retry
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    if (!profileExists) {
        // If profile still doesn't exist, we can't create the referral record yet because of FK constraint
        console.error(`Referral FAILED: Profile for invitee ${inviteeId} never appeared after retries.`);
        return { success: false, error: 'Profile not ready' };
    }

    // 4. Create Referral Record
    // Note: We've already verified profile existence above to prevent FK violation
    const { error: insertError } = await supabaseAdmin
      .from('referrals')
      .insert({
        inviter_id: inviterId,
        invitee_id: inviteeId,
        status: 'completed'
      })

    if (insertError) {
      console.error('Referral insert error:', insertError)
      return { success: false, error: 'Failed to record referral' }
    }

    // 5. Reward Inviter
    const { error: inviterUpdateError } = await supabaseAdmin.from('profiles').update({
      credits: inviter.credits + REFERRAL_BONUS
    }).eq('id', inviterId)

    if (!inviterUpdateError) {
        await supabaseAdmin.from('transactions').insert({
          user_id: inviterId,
          type: 'REFERRAL_REWARD',
          credits_change: REFERRAL_BONUS,
          description: 'Referral Bonus (Invited a friend)'
        })
    } else {
        console.error('Failed to reward inviter:', inviterUpdateError)
    }

    // 6. Reward Invitee
    const { data: invitee } = await supabaseAdmin
      .from('profiles')
      .select('id, credits')
      .eq('id', inviteeId)
      .single()

    if (invitee) {
      // Refresh credits before update to avoid race conditions
      const { error: inviteeUpdateError } = await supabaseAdmin.from('profiles').update({
        credits: invitee.credits + REFERRAL_BONUS
      }).eq('id', inviteeId)

      if (!inviteeUpdateError) {
          await supabaseAdmin.from('transactions').insert({
            user_id: inviteeId,
            type: 'REFERRAL_REWARD',
            credits_change: REFERRAL_BONUS,
            description: 'Referral Bonus (Welcome Gift)'
          })
      } else {
        console.error('Failed to reward invitee:', inviteeUpdateError)
      }
    }

    return { success: true }

  } catch (error) {
    console.error('Process referral error:', error)
    return { success: false, error: 'Internal error' }
  }
}

export async function getReferralStatsAction(userId: string) {
  const supabase = supabaseAdmin // or use regular client if RLS allows, but count is easier with admin
  
  const { count, error } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('inviter_id', userId)

  if (error) {
    console.error('Error fetching referral stats:', error)
    return { count: 0, creditsEarned: 0 }
  }

  return {
    count: count || 0,
    creditsEarned: (count || 0) * REFERRAL_BONUS
  }
}

export async function getReferralsListAction(userId: string, page: number = 1, limit: number = 10) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== userId) {
      return { data: [], count: 0 }
  }

  const adminClient = supabaseAdmin
  
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await adminClient
    .from('referrals')
    .select(`
      id,
      created_at,
      status,
      invitee:profiles!referrals_invitee_id_fkey(email, name)
    `, { count: 'exact' })
    .eq('inviter_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching referrals list:', error)
    return { data: [], count: 0 }
  }

  // Mask emails for privacy
  const formatted = data.map((item: any) => {
    // invitee might be returned as an array or object depending on relationship definition
    const inviteeData = Array.isArray(item.invitee) ? item.invitee[0] : item.invitee
    
    const email = inviteeData?.email || 'Unknown'
    const name = inviteeData?.name || 'Traveler'
    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    
    return {
      id: item.id,
      createdAt: item.created_at,
      status: item.status,
      inviteeName: name,
      inviteeEmail: maskedEmail
    }
  })

  return {
    data: formatted,
    count: count || 0
  }
}
