import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const launchDate = new Date("2026-09-16T00:00:00");

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PRICE_ID) {
      throw new Error("Missing NEXT_PUBLIC_STRIPE_PRICE_ID");
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      throw new Error("Missing NEXT_PUBLIC_SITE_URL");
    }

    const trialEnd = Math.floor(launchDate.getTime() / 1000);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_collection: "always",
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_end: trialEnd,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown checkout error";

    console.error("Stripe checkout error:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}