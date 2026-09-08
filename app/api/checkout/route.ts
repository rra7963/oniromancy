import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { stripe } from '../../../services/stripe';

export async function POST(req: Request) {
  try {
    const { userId, email, type, cycle, amount } = await req.json();
    const cookieStore = await cookies();
    // Support both new 'ivt_code' (unified) and legacy 'ref_code'
    const referralCode = cookieStore.get('ivt_code')?.value || cookieStore.get('ref_code')?.value;

    if (!userId || !email || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (type !== 'SUBSCRIPTION' && type !== 'CREDITS') {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const commonMetadata = {
      userId,
      type,
      ...(referralCode && { referralCode }),
    };

    const sessionConfig: any = {
      payment_method_types: ["card", "samsung_pay", "link"],
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_email: email,
      client_reference_id: userId,
      success_url: `${origin}/orders?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: commonMetadata,
      payment_intent_data: {
        metadata: commonMetadata,
      },
      subscription_data: {
        metadata: commonMetadata,
      },
      mode: "subscription",
    };

    if (type === 'SUBSCRIPTION') {
      if (cycle !== 'monthly' && cycle !== 'yearly') {
        return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 });
      }
      const priceAmount = cycle === 'yearly' ? 8400 : 999;
      const priceName = cycle === 'yearly' ? 'Mystic Plan (Yearly)' : 'Mystic Plan (Monthly)';
      const interval = cycle === 'yearly' ? 'year' : 'month';
      const desc = cycle === 'yearly'
        ? 'Access to premium features and monthly credits for a year.'
        : 'Access to premium features and monthly credits for a month.';
      
      const imageUrl = cycle === 'yearly'
        ? 'https://placehold.co/400x400/1e1b4b/fbbf24.png?text=Mystic+Plan+(Yearly)'
        : 'https://placehold.co/400x400/1e1b4b/fbbf24.png?text=Mystic+Plan+(Monthly)';

      sessionConfig.mode = 'subscription';
      sessionConfig.subscription_data = {
        metadata: commonMetadata,
      };
      delete sessionConfig.payment_intent_data;

      sessionConfig.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: priceName,
              description: desc,
              images: [imageUrl],
            },
            unit_amount: priceAmount,
            recurring: {
              interval: interval,
            },
          },
          quantity: 1,
        },
      ];
      sessionConfig.metadata.creditsAmount = amount?.toString() || '0';
    } else {
        // One-time payment (CREDITS)
         sessionConfig.mode = 'payment';
         sessionConfig.invoice_creation = {
           enabled: true,
         };
         sessionConfig.payment_intent_data = {
             metadata: commonMetadata,
         };
        delete sessionConfig.subscription_data;
        
        const imageUrl = 'https://placehold.co/400x400/1e1b4b/fbbf24.png?text=Credits+Pack';
        
        sessionConfig.line_items = [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `${amount} Credits Pack`,
                  description: 'Instant credits for daily horoscopes, dream visualization and tarot readings.',
                  images: [imageUrl],
                },
                unit_amount: 0,
              },
              quantity: 1,
            },
        ];
        
        let costInCents = 0;
        if (amount === 30) costInCents = 99;
        else if (amount === 50) costInCents = 499;
        else if (amount === 200) costInCents = 999;
        else if (amount === 500) costInCents = 2999;
        else {
             return NextResponse.json({ error: 'Invalid credit pack amount' }, { status: 400 });
        }
        
        sessionConfig.line_items[0].price_data.unit_amount = costInCents;
        sessionConfig.metadata.creditsAmount = amount.toString();
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
