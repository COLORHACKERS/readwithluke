import { NextResponse } from "next/server";
import Stripe from "stripe";

type ReaderPlan =
  | "monthly"
  | "partner30";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(
      body.email ?? ""
    )
      .trim()
      .toLowerCase();

    /* =========================================
       PLAN
    ========================================= */

    const selectedPlan: ReaderPlan =
      body.plan === "partner30"
        ? "partner30"
        : "monthly";

    const isPartner30 =
      selectedPlan === "partner30";

    /* =========================================
       ENVIRONMENT VARIABLES
    ========================================= */

    const secretKey =
      process.env.STRIPE_SECRET_KEY;

    const monthlyPriceId =
      process.env.STRIPE_MONTHLY_PRICE_ID ||
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.readwithluke.com"
    ).replace(/\/$/, "");

    /* =========================================
       VALIDATION
    ========================================= */

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
      !monthlyPriceId.startsWith(
        "price_"
      )
    ) {
      throw new Error(
        "STRIPE_MONTHLY_PRICE_ID must contain a Stripe Price ID beginning with price_."
      );
    }

    /* =========================================
       STRIPE
    ========================================= */

    const stripe =
      new Stripe(secretKey);

    /*
     * NORMAL MEMBER:
     * 7 days free → $4.99/month
     *
     * PARTNER:
     * 30 days free → $4.99/month
     */
    const trialDays =
      isPartner30 ? 30 : 7;

    const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData =
      {
        trial_period_days:
          trialDays,

        metadata: {
          email,
          plan:
            selectedPlan,
        },
      };

    /* =========================================
       CREATE CHECKOUT
    ========================================= */

    const session =
      await stripe.checkout.sessions.create({
        /*
         * Stripe checkout is embedded
         * directly inside Read With Luke.
         */
        ui_mode:
          "embedded_page",

        mode:
          "subscription",

        /*
         * The monthly $4.99 Stripe price
         * is used for BOTH normal members
         * and Partner Pass members.
         *
         * The only difference is
         * the trial length.
         */
        line_items: [
          {
            price:
              monthlyPriceId,

            quantity:
              1,
          },
        ],

        customer_email:
          email,

        /*
         * Collect the payment method
         * during the free trial.
         */
        payment_method_collection:
          "always",

        subscription_data:
          subscriptionData,

        metadata: {
          email,
          plan:
            selectedPlan,
        },

        /*
         * After Stripe checkout,
         * continue account creation.
         */
        return_url:
          `${siteUrl}/complete-signup` +
          `?session_id={CHECKOUT_SESSION_ID}`,
      });

    if (
      !session.client_secret
    ) {
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
        error:
          message,
      },
      {
        status:
          500,
      }
    );
  }
}
