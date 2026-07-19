import { NextResponse } from "next/server";
import Stripe from "stripe";

type ReaderPlan = "monthly" | "yearly";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userId = String(body.userId ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();

    const selectedPlan: ReaderPlan =
      body.plan === "yearly" ? "yearly" : "monthly";

    const secretKey = process.env.STRIPE_SECRET_KEY;

    /*
     * This fallback lets your existing monthly Stripe
     * environment variable continue working.
     */
    const monthlyPriceId =
      process.env.STRIPE_MONTHLY_PRICE_ID ||
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    const yearlyPriceId =
      process.env.STRIPE_YEARLY_PRICE_ID;

    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.readwithluke.com"
    ).replace(/\/$/, "");

    if (!secretKey) {
      throw new Error(
        "Missing STRIPE_SECRET_KEY"
      );
    }

    if (!userId) {
      throw new Error("Missing userId");
    }

    if (!email) {
      throw new Error("Missing email");
    }

    if (!monthlyPriceId) {
      throw new Error(
        "Missing monthly Stripe price ID"
      );
    }

    if (
      selectedPlan === "yearly" &&
      !yearlyPriceId
    ) {
      throw new Error(
        "Missing STRIPE_YEARLY_PRICE_ID"
      );
    }

    const priceId =
      selectedPlan === "yearly"
        ? yearlyPriceId
        : monthlyPriceId;

    if (!priceId) {
      throw new Error(
        "Unable to determine Stripe price ID"
      );
    }

    const stripe = new Stripe(secretKey);

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email: email,

        payment_method_collection: "always",

        client_reference_id: userId,

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        /*
         * Monthly receives the 7-day trial.
         * Yearly is charged immediately.
         */
        subscription_data: {
          metadata: {
            user_id: userId,
            plan: selectedPlan,
          },

          ...(selectedPlan === "monthly"
            ? {
                trial_period_days: 7,
              }
            : {}),
        },

        metadata: {
          user_id: userId,
          plan: selectedPlan,
        },

        success_url:
          `${siteUrl}/dashboard?checkout=success`,

        cancel_url:
          `${siteUrl}/membership?checkout=cancelled`,
      });

    if (!session.url) {
      throw new Error(
        "Stripe did not return a checkout URL"
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Checkout error";

    console.error(
      "Create checkout session error:",
      error
    );

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
