import { NextResponse } from "next/server";
import Stripe from "stripe";

type ReaderPlan = "monthly" | "yearly" | "partner30";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userId = String(body.userId ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    let selectedPlan: ReaderPlan = "monthly";

    if (body.plan === "yearly") {
      selectedPlan = "yearly";
    } else if (body.plan === "partner30") {
      selectedPlan = "partner30";
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;

    /*
     * partner30 uses the normal monthly Stripe price,
     * but receives a 30-day trial instead of 7 days.
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
      throw new Error("Missing STRIPE_SECRET_KEY");
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

    const isYearly = selectedPlan === "yearly";
    const isPartner30 =
      selectedPlan === "partner30";

    /*
     * Yearly uses the yearly price.
     * Monthly and partner30 both use the monthly price.
     */
    const priceId = isYearly
      ? yearlyPriceId
      : monthlyPriceId;

    if (!priceId) {
      throw new Error(
        "Unable to determine Stripe price ID"
      );
    }

    const stripe = new Stripe(secretKey);

    /*
     * Monthly: 7-day trial
     * Partner: 30-day trial
     * Yearly: charged immediately
     */
    const trialDays = isPartner30 ? 30 : 7;

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email: email,

        /*
         * Always collect a payment method now so Stripe
         * can begin billing after the trial ends.
         */
        payment_method_collection: "always",

        client_reference_id: userId,

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        subscription_data: isYearly
          ? {
              metadata: {
                user_id: userId,
                plan: selectedPlan,
              },
            }
          : {
              trial_period_days: trialDays,

              metadata: {
                user_id: userId,
                plan: selectedPlan,
              },
            },

        metadata: {
          user_id: userId,
          plan: selectedPlan,
        },

        success_url:
          `${siteUrl}/dashboard?checkout=success&plan=${selectedPlan}`,

        cancel_url: isPartner30
          ? `${siteUrl}/partner-pass?checkout=cancelled`
          : `${siteUrl}/membership?checkout=cancelled`,
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
