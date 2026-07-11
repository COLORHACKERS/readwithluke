import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const {
      userId,
      purchaserEmail,
      parentEmail,
      relationship,
      progressEmails,
      familyConfirmed,
    } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const giftPriceId = process.env.STRIPE_GIFT_PRICE_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!secretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    if (!giftPriceId) {
      throw new Error("Missing STRIPE_GIFT_PRICE_ID");
    }

    if (!siteUrl) {
      throw new Error("Missing NEXT_PUBLIC_SITE_URL");
    }

    if (!userId) {
      throw new Error("Missing userId");
    }

    if (!purchaserEmail) {
      throw new Error("Missing purchaser email");
    }

    if (!parentEmail) {
      throw new Error("Missing parent email");
    }

    if (!relationship) {
      throw new Error("Missing relationship");
    }

    if (!familyConfirmed) {
      return NextResponse.json(
        { error: "Family confirmation is required." },
        { status: 400 }
      );
    }

    const stripe = new Stripe(secretKey);

    const metadata = {
      purchaser_user_id: String(userId),
      purchaser_email: String(purchaserEmail),
      parent_email: String(parentEmail).trim().toLowerCase(),
      relationship: String(relationship),
      progress_emails: String(Boolean(progressEmails)),
      family_confirmed: "true",
      membership_type: "gift",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: purchaserEmail,
      payment_method_collection: "always",
      client_reference_id: userId,

      line_items: [
        {
          price: giftPriceId,
          quantity: 1,
        },
      ],

      subscription_data: {
        metadata,
      },

      metadata,

      success_url: `${siteUrl}/dashboard?gift=success`,
      cancel_url: `${siteUrl}/membership?gift=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Gift checkout error:", error);

    const message =
      error instanceof Error ? error.message : "Gift checkout error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
