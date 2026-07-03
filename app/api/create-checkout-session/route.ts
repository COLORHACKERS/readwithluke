import { NextResponse } from "next/server";
import Stripe from "stripe";

const trialEnd = Math.floor(launchDate.getTime() / 1000);

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY");
    if (!priceId) throw new Error("Missing NEXT_PUBLIC_STRIPE_PRICE_ID");
    if (!siteUrl) throw new Error("Missing NEXT_PUBLIC_SITE_URL");
    if (!userId) throw new Error("Missing userId");
f
    const stripe = new Stripe(secretKey);
    const trialEnd = Math.floor(launchDate.getTime() / 1000);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      payment_method_collection: "always",
      client_reference_id: userId,
      line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
  trial_period_days: 7,
  metadata: { user_id: userId },
},
    
      metadata: { user_id: userId },
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/membership?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
