import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth } from '@/firebase/admin';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceId = process.env.STRIPE_PRICE_ID;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const body = await request.json().catch(() => ({}));
    const lookupKey =
      typeof body?.lookupKey === 'string' ? body.lookupKey : undefined;
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';

    if (!lookupKey && !stripePriceId) {
      return NextResponse.json(
        { error: 'STRIPE_PRICE_ID is not set.' },
        { status: 500 }
      );
    }

    const resolvedPriceId = lookupKey
      ? (
          await stripe.prices.list({
            lookup_keys: [lookupKey],
            limit: 1,
          })
        ).data[0]?.id
      : stripePriceId;

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: 'Stripe price not found.' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: `${origin}/profile?upgrade=success`,
      cancel_url: `${origin}/pricing?upgrade=cancel`,
      customer_email: decoded.email,
      metadata: {
        uid: decoded.uid,
        email: decoded.email ?? '',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
