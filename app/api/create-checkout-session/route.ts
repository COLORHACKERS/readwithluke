import { NextResponse } from "next/server";
import Stripe from "stripe";

type ReaderPlan =
  | "monthly"
  | "yearly"
  | "partner30";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const selectedPlan: ReaderPlan =
      body.plan === "yearly"
        ? "yearly"
        : body.plan === "partner30"
          ? "partner30"
          : "monthly";

    const secretKey =
      process.env.STRIPE_SECRET_KEY;

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

    if (!email) {
      throw new Error(
        "Please enter a valid email address."
      );
    }

    if (!monthlyPriceId) {
      throw new Error(
        "Missing STRIPE_MONTHLY_PRICE_ID"
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

    const isYearly =
      selectedPlan === "yearly";

    const isPartner30 =
      selectedPlan === "partner30";

    const priceId = isYearly
      ? yearlyPriceId
      : monthlyPriceId;

    if (!priceId) {
      throw new Error(
        "Unable to determine the Stripe price."
      );
    }

    if (!priceId.startsWith("price_")) {
      throw new Error(
        "The Stripe environment variable must contain a Price ID beginning with price_."
      );
    }

    const stripe =
      new Stripe(secretKey);

    const trialDays =
      isPartner30 ? 30 : 7;

    const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData =
      {
        metadata: {
          email,
          plan: selectedPlan,
        },

        ...(!isYearly
          ? {
              trial_period_days:
                trialDays,
            }
          : {}),
      };

    const session =
      await stripe.checkout.sessions.create({
        /*
         * EMBED STRIPE DIRECTLY
         * INSIDE READ WITH LUKE
         */
        ui_mode: "embedded_page",

        mode: "subscription",

        customer_email: email,

        /*
         * Collect card information
         * even though today's charge
         * is $0 during the trial.
         */
        payment_method_collection:
          "always",

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        subscription_data:
          subscriptionData,

        metadata: {
          email,
          plan: selectedPlan,
        },

        /*
         * Embedded Checkout uses
         * return_url instead of
         * success_url / cancel_url.
         */
        return_url:
          `${siteUrl}/complete-signup` +
          `?session_id={CHECKOUT_SESSION_ID}`,
      });

    if (!session.client_secret) {
      throw new Error(
        "Stripe did not return an embedded checkout client secret."
      );
    }

    return NextResponse.json({
      clientSecret:
        session.client_secret,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to start checkout.";

    console.error(
      "Create embedded checkout session error:",
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
