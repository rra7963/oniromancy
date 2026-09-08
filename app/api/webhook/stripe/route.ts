import { NextResponse } from 'next/server';
import { stripe } from '@/services/stripe';
import { supabaseAdmin } from '@/services/supabase/admin';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createHash } from 'crypto';

const stableUuidFromString = (input: string): string => {
  const hash = createHash('sha256').update(input).digest();
  const bytes = Uint8Array.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Buffer.from(bytes).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

/**
 * Handles referral logic for both Partners (Affiliates) and User Referrals.
 * 
 * Logic:
 * 1. Check if the code belongs to a Partner (ref_code).
 *    - If yes: Log a 'commission' record (or just a tag for now) for payout calculation.
 * 2. Check if the code belongs to a User (profile id).
 *    - If yes: Grant credits to the referrer? 
 *      - Usually User Referral rewards are for SIGNUP (one-time).
 *      - But if we want to reward for PURCHASE (revenue share in credits), we can do it here.
 *      - Currently, referral.ts only handles SIGNUP rewards.
 *      - For this task, let's assume we just want to track it or maybe user meant Partners?
 *      - User input: "partners功能是通过ref_code来进行stripe分成的，而邀请功能是通过ivt_code来发放积分的"
 *      - So we need to distinguish based on what the code IS.
 */
async function handleReferralOrPartner(
  userId: string,
  code: string,
  amountTotalCents: number,
  currency: string,
  transactionId: string,
  stripeSessionId: string
) {
  // 1. Try to find a Partner with this ref_code
  const { data: partner } = await supabaseAdmin
    .from('partners')
    .select('id, name')
    .eq('ref_code', code)
    .single();

  if (partner) {
    console.log(`[Partner] Purchase attributed to partner ${partner.name} (${code}). Amount: ${amountTotalCents / 100} ${currency}`);
    
    // Calculate Commission (e.g., 30%)
    const commissionRate = 0.30;
    const commissionAmount = (amountTotalCents / 100) * commissionRate;

    // Record Commission
    const { error: commError } = await supabaseAdmin
      .from('partner_commissions')
      .insert({
        partner_id: partner.id,
        transaction_id: transactionId,
        stripe_session_id: stripeSessionId,
        amount: commissionAmount,
        currency: currency,
        status: 'pending'
      });

    if (commError) {
      console.error('Failed to record partner commission:', commError);
    } else {
      console.log(`[Partner] Commission recorded: ${commissionAmount} ${currency}`);
    }
    return;
  }

  // 2. Try to find a User with this ID (User Referral)
  // Check if 'code' is a valid UUID (User ID)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code);
  
  if (isUuid) {
     // This is likely a User ID (Invite Friend)
     // Usually invite rewards are given at signup.
     // But if we want to give % back on purchase, we do it here.
     // Current requirement seems to imply we just need to ensure we don't mix them up.
     // If it's a UUID, it's a user invite. If it's a string, it's a partner.
     console.log(`[Referral] Purchase attributed to referrer ${code}.`);
     
     // Optional: Grant small credit bonus to referrer for purchase?
     // For now, we'll just log it. The main referral bonus is on signup.
     return;
  }
}

// Helper to handle subscription upgrade (first successful checkout)
async function handleSubscriptionUpgrade(
  userId: string,
  subscriptionId: string,
  checkoutSessionId: string,
  amountTotal: number,
  currency: string | null,
  referralCode?: string
) {
  const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as unknown as {
    current_period_end: number | null | undefined;
    items?: {
      data?: Array<{
        current_period_end?: number;
        plan?: { interval?: string | null };
        price?: { recurring?: { interval?: string | null } | null } | null;
      }>;
    };
  };

  const periodEndTimestamp = subscription.current_period_end ?? subscription.items?.data?.[0]?.current_period_end;

  if (typeof periodEndTimestamp !== 'number') {
      console.error(`Invalid subscription data for ${subscriptionId}:`, JSON.stringify(subscription));
      throw new Error('Invalid subscription data: missing or invalid current_period_end');
  }

  const currentPeriodEnd = new Date(periodEndTimestamp * 1000);
  if (isNaN(currentPeriodEnd.getTime())) {
      console.error(`Invalid date calculated from timestamp ${periodEndTimestamp} for subscription ${subscriptionId}`);
      throw new Error('Invalid subscription period end date');
  }
  
  const endDateIso = currentPeriodEnd.toISOString();
  const interval = subscription.items?.data?.[0]?.price?.recurring?.interval ?? subscription.items?.data?.[0]?.plan?.interval ?? 'month';
  const creditsToGrant = interval === 'year' ? 6000 : 500;

  const upgradeTxId = stableUuidFromString(`stripe:checkout.session.completed:subscription:${checkoutSessionId}`);
  const upgradeDescription = `Upgraded to Pro Tier [${checkoutSessionId}]`;

  // --- REFERRAL / PARTNER LOGIC ---
  if (referralCode) {
    try {
      await handleReferralOrPartner(userId, referralCode, amountTotal, currency || 'usd', upgradeTxId, checkoutSessionId);
    } catch (e) {
      console.error('Failed to handle referral/partner logic during upgrade:', e);
      // Don't block the main upgrade flow
    }
  }
  // --------------------------------

  const { data: insertedTx, error: upsertError } = await supabaseAdmin
    .from('transactions')
    .upsert(
      {
        id: upgradeTxId,
        user_id: userId,
        type: 'SUBSCRIPTION',
        amount: amountTotal / 100,
        currency: currency ?? 'usd',
        credits_change: creditsToGrant,
        description: upgradeDescription,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )
    .select('id')
    .maybeSingle();

  if (upsertError) {
      console.error('Failed to insert subscription transaction:', upsertError);
      throw upsertError;
  }
  
  // If transaction already existed, we might have already processed this event.
  // However, we still check the profile to be sure.
  if (!insertedTx) {
      return;
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('credits,subscription_end_date')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      await supabaseAdmin.from('transactions').delete().eq('id', upgradeTxId);
      console.error('Profile fetch error:', fetchError);
      throw new Error('Profile not found');
    }

    // Check if we actually need to update the date.
    // If the existing date is already LATER than the new one, we might be overwriting a longer sub?
    // But since this is a new checkout, we should trust the new date for the subscription.
    // However, let's log it.
    if (profile.subscription_end_date && new Date(profile.subscription_end_date) > currentPeriodEnd) {
        console.warn(`User ${userId} has subscription end date ${profile.subscription_end_date} which is later than new date ${endDateIso}. Overwriting anyway as this is a new checkout.`);
    }

    const currentCredits = Number(profile.credits ?? 0);
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        tier: 'PRO',
        credits: currentCredits + creditsToGrant,
        subscription_end_date: endDateIso,
      })
      .eq('id', userId)
      .eq('credits', currentCredits) // Optimistic locking
      .select('credits')
      .maybeSingle();

    if (updateError) {
        console.error(`Profile update error (attempt ${attempt + 1}):`, updateError);
        continue;
    }
    
    if (!updated) {
        console.warn(`Profile update failed (optimistic lock or condition), retrying (attempt ${attempt + 1})...`);
        // Small delay to reduce contention
        await new Promise(resolve => setTimeout(resolve, 200));
        continue;
    }

    console.log(`Successfully upgraded user ${userId} to PRO. Credits: ${currentCredits} -> ${currentCredits + creditsToGrant}, EndDate: ${endDateIso}`);
    return;
  }

  // Final verification: did it happen anyway?
  const { data: finalProfile } = await supabaseAdmin
    .from('profiles')
    .select('subscription_end_date, credits')
    .eq('id', userId)
    .single();

  if (finalProfile?.subscription_end_date && new Date(finalProfile.subscription_end_date).toISOString() >= endDateIso) {
     console.log('Profile seems to be updated despite update failure (maybe concurrent update?), considering success.');
     return;
  }

  console.error('Failed to apply subscription upgrade after all retries.');
  await supabaseAdmin.from('transactions').delete().eq('id', upgradeTxId);
  throw new Error('Failed to apply subscription upgrade');
}

// Helper to handle credit purchase
async function handleCreditPurchase(
  userId: string,
  creditsAmount: number,
  costAmount: number,
  currency: string,
  checkoutSessionId: string,
  referralCode?: string
) {
  const normalizedCredits = Number.isFinite(creditsAmount) ? creditsAmount : NaN;
  if (!Number.isInteger(normalizedCredits) || normalizedCredits <= 0) return;

  const purchaseTxId = stableUuidFromString(`stripe:checkout.session.completed:${checkoutSessionId}`);
  const purchaseDescription = `Purchased ${normalizedCredits} Credits [${checkoutSessionId}]`;

  // --- REFERRAL / PARTNER LOGIC ---
  if (referralCode) {
    try {
      await handleReferralOrPartner(userId, referralCode, costAmount, currency || 'usd', purchaseTxId, checkoutSessionId);
    } catch (e) {
      console.error('Failed to handle referral/partner logic during purchase:', e);
      // Don't block
    }
  }
  // --------------------------------

  const { data: insertedTx, error: upsertError } = await supabaseAdmin
    .from('transactions')
    .upsert(
      {
        id: purchaseTxId,
        user_id: userId,
        type: 'PURCHASE',
        amount: costAmount / 100,
        currency,
        credits_change: normalizedCredits,
        description: purchaseDescription,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )
    .select('id')
    .maybeSingle();

  if (upsertError) {
      console.error('Failed to insert credit purchase transaction:', upsertError);
      throw upsertError;
  }
  
  if (!insertedTx) {
      console.log('Credit purchase transaction already exists, skipping:', purchaseTxId);
      return;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      await supabaseAdmin.from('transactions').delete().eq('id', purchaseTxId);
      console.error('Profile fetch error:', fetchError);
      throw new Error('Profile not found');
    }

    const currentCredits = Number(profile.credits ?? 0);
    const nextCredits = currentCredits + normalizedCredits;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ credits: nextCredits })
      .eq('id', userId)
      .eq('credits', currentCredits)
      .select('credits')
      .maybeSingle();

    if (updateError) continue;
    if (!updated) continue;

    return;
  }

  await supabaseAdmin.from('transactions').delete().eq('id', purchaseTxId);
  throw new Error('Failed to apply credit purchase');
}

// Helper to handle subscription renewal
async function handleSubscriptionRenewal(
  subscriptionId: string,
  invoiceId: string,
  amountTotal: number | null,
  currency: string | null,
  invoicePeriodEnd: number | null
) {
  // Retrieve subscription from Stripe to get latest status and metadata
  const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as unknown as {
    current_period_end: number | null | undefined;
    metadata?: Record<string, string>;
    items?: {
      data?: Array<{
        current_period_end?: number;
        plan?: { interval?: string | null };
        price?: { recurring?: { interval?: string | null } | null } | null;
      }>;
    };
  };
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('Subscription renewal missing userId in metadata');
    return;
  }

  // Use invoice period end if available (more reliable during webhook processing), otherwise fall back to subscription data
  const periodEndTimestamp = invoicePeriodEnd ?? subscription.current_period_end ?? subscription.items?.data?.[0]?.current_period_end;

  if (typeof periodEndTimestamp !== 'number') {
      console.error(`Subscription renewal ${subscriptionId} missing current_period_end`);
      // We can't update subscription end date if we don't have it.
      // But maybe we should still grant credits?
      // For now, let's treat it as error.
      throw new Error('Invalid subscription data: missing current_period_end');
  }

  const currentPeriodEnd = new Date(periodEndTimestamp * 1000);
  if (isNaN(currentPeriodEnd.getTime())) {
       throw new Error('Invalid subscription period end date');
  }
  const currentPeriodEndIso = currentPeriodEnd.toISOString();
  const interval = subscription.items?.data?.[0]?.price?.recurring?.interval ?? subscription.items?.data?.[0]?.plan?.interval ?? 'month';
  const creditsToGrant = interval === 'year' ? 6000 : 500;
  const renewalDescription = `Subscription Renewal (${invoiceId})`;

  console.log(`Processing renewal for user ${userId}. New Period End: ${currentPeriodEndIso}. Granting ${creditsToGrant} credits.`);

  for (let attempt = 0; attempt < 2; attempt++) {
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('credits,subscription_end_date')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      console.error('Profile fetch error during renewal:', fetchError);
      return;
    }

    const currentCredits = Number(profile.credits ?? 0);
    
    // Log if we are about to skip update due to date condition
    if (profile.subscription_end_date && new Date(profile.subscription_end_date) >= currentPeriodEnd) {
        console.warn(`Renewal skipped: Profile end date (${profile.subscription_end_date}) >= New period end (${currentPeriodEndIso}). This might be a duplicate event.`);
        
        // Ensure transaction is recorded even if profile was already updated
        // (e.g. previous run updated profile but failed to insert transaction)
        const renewalTxId = stableUuidFromString(`stripe:invoice.payment_succeeded:${invoiceId}`);
        const { error: txError } = await supabaseAdmin.from('transactions').upsert({
             id: renewalTxId,
             user_id: userId,
             type: 'SUBSCRIPTION_RENEWAL',
             amount: amountTotal ? amountTotal / 100 : 0,
             currency: currency || 'usd',
             credits_change: creditsToGrant,
             description: renewalDescription,
        }, { onConflict: 'id', ignoreDuplicates: true });
        
        if (txError) {
             console.error('Failed to ensure renewal transaction on duplicate event:', txError);
        } else {
             console.log('Ensured renewal transaction exists for skipped event.');
        }

        return;
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        tier: 'PRO',
        subscription_end_date: currentPeriodEndIso,
        credits: currentCredits + creditsToGrant,
      })
      .eq('id', userId)
      .eq('credits', currentCredits)
      .select('credits')
      .maybeSingle();

    if (updateError) {
      console.error('Failed to update profile for renewal:', updateError);
      throw updateError;
    }

    if (!updated) {
        console.warn(`Profile update for renewal failed (optimistic lock or condition), retrying...`);
        continue;
    }

    const renewalTxId = stableUuidFromString(`stripe:invoice.payment_succeeded:${invoiceId}`);

    const { error: txError } = await supabaseAdmin.from('transactions').upsert({
      id: renewalTxId,
      user_id: userId,
      type: 'SUBSCRIPTION_RENEWAL',
      amount: amountTotal ? amountTotal / 100 : 0,
      currency: currency || 'usd',
      credits_change: creditsToGrant,
      description: renewalDescription,
    }, { onConflict: 'id', ignoreDuplicates: true });

    if (txError) {
        console.error('Failed to insert renewal transaction:', txError);
        // Do not throw, as profile is already updated.
    }
    
    console.log(`Successfully renewed subscription for user ${userId}.`);
    return;
  }

  // Fallback: If credit update failed repeatedly, try to at least update the date
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      tier: 'PRO',
      subscription_end_date: currentPeriodEndIso,
    })
    .eq('id', userId)
    .or(`subscription_end_date.is.null,subscription_end_date.lt."${currentPeriodEndIso}"`);

  if (updateError) throw updateError;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    console.error(`Webhook signature verification failed.`, err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Expand session to get line items if needed, or rely on metadata
      // Ideally metadata should be enough if we populated it correctly.
      // But for subscription, we need subscription ID which is usually present.
      
      const { userId, type, creditsAmount, referralCode } = (session.metadata ?? {}) as Record<string, string>;

      if (!userId) {
        console.warn('Webhook received without userId in metadata. Session ID:', session.id);
        return NextResponse.json({ received: true });
      }

      console.log(`Processing checkout session ${session.id} for user ${userId}, type: ${type}, ref: ${referralCode}`);

      if (type === 'SUBSCRIPTION') {
        if (session.payment_status !== 'paid') {
          console.log('Subscription checkout not paid yet:', session.id);
          return NextResponse.json({ received: true });
        }
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id;

        if (!subscriptionId) {
          console.error('Subscription checkout missing subscription id');
          return NextResponse.json({ received: true });
        }

        await handleSubscriptionUpgrade(
          userId,
          subscriptionId,
          session.id,
          session.amount_total ?? 0,
          session.currency ?? 'usd',
          referralCode
        );
      } else if (type === 'CREDITS') {
        if (session.payment_status !== 'paid') {
          console.log('Credit checkout not paid yet:', session.id);
          return NextResponse.json({ received: true });
        }
        await handleCreditPurchase(
          userId,
          parseInt(creditsAmount, 10),
          session.amount_total ?? 0,
          session.currency ?? 'usd',
          session.id,
          referralCode
        );
      } else {
          console.warn('Unknown checkout session type:', type);
      }
    } else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as unknown as {
        id: string;
        created: number;
        currency: string | null;
        billing_reason?: string | null;
        subscription?: string | { id: string } | null;
        amount_paid?: number | null;
        amount_due?: number | null;
        lines?: {
          data?: Array<{
            period?: {
              end?: number;
            };
            parent?: {
                subscription_item_details?: {
                    subscription?: string;
                }
            };
            subscription?: string;
          }>;
        };
        parent?: {
            subscription_details?: {
                subscription?: string;
            }
        };
      };

      if (invoice.billing_reason === 'subscription_cycle') {
        let subscriptionId = typeof invoice.subscription === 'string' 
            ? invoice.subscription 
            : invoice.subscription?.id;
        
        // Fallback: try to find subscription ID in parent details or lines
        if (!subscriptionId) {
            subscriptionId = invoice.parent?.subscription_details?.subscription;
        }
        if (!subscriptionId) {
             subscriptionId = invoice.lines?.data?.[0]?.parent?.subscription_item_details?.subscription 
                ?? invoice.lines?.data?.[0]?.subscription;
        }
            
        if (subscriptionId) {
            const invoicePeriodEnd = invoice.lines?.data?.[0]?.period?.end ?? null;
            await handleSubscriptionRenewal(
              subscriptionId,
              invoice.id,
              invoice.amount_paid ?? invoice.amount_due ?? null,
              invoice.currency ?? null,
              invoicePeriodEnd
            );
        } else {
             console.warn('Subscription renewal invoice missing subscription ID:', invoice.id);
             // Log structure to help debugging if it happens again
             console.warn('Invoice structure:', JSON.stringify(invoice, null, 2));
        }
      } else {
          console.log(`Skipping invoice ${invoice.id} with billing_reason: ${invoice.billing_reason}`);
      }
    }
  } catch (err: unknown) {
    console.error('Webhook processing failed:', err);
    return NextResponse.json({ error: 'Processing Error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
