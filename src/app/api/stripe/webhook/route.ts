import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/firebase/admin';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set.');
}

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const uid = session.metadata?.uid;

    if (uid) {
      const userRef = adminDb.collection('users').doc(uid);
      await userRef.set(
        {
          isUpgraded: true,
          stripeCustomerId: session.customer ?? null,
          stripeSubscriptionId: session.subscription ?? null,
          upgradedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } else {
      console.warn('Stripe webhook missing uid metadata.');
    }
  }

  return NextResponse.json({ received: true });
}
