import { NextResponse } from "next/server";
import Stripe from "stripe";

type GiftPlan =
  | "gift-monthly"
  | "gift-yearly";

export async function POST(req: Request) {
  try {
    const {
      gifterName,
      gifterEmail,
      guardianEmail,
      relationship,
      progressReportRequested,
      plan,
    } = await req.json();

    /* =========================================
       ENVIRONMENT VARIABLES
    ========================================= */

    const secretKey =
      process.env.STRIPE_SECRET_KEY;

    const giftMonthlyPriceId =
      process.env.STRIPE_GIFT_MONTHLY_PRICE_ID;

    const giftYearlyPriceId =
      process.env.STRIPE_GIFT_YEARLY_PRICE_ID;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL;

    if (!secretKey) {
      throw new Error(
        "Missing STRIPE_SECRET_KEY"
      );
    }

    if (!giftMonthlyPriceId) {
      throw new Error(
        "Missing STRIPE_GIFT_MONTHLY_PRICE_ID"
      );
    }

    if (!giftYearlyPriceId) {
      throw new Error(
        "Missing STRIPE_GIFT_YEARLY_PRICE_ID"
      );
    }

    if (!siteUrl) {
      throw new Error(
        "Missing NEXT_PUBLIC_SITE_URL"
      );
    }

    /* =========================================
       CLEAN INPUTS
    ========================================= */

    const cleanGifterName =
      String(gifterName || "").trim();

    const cleanGifterEmail =
      String(gifterEmail || "")
        .trim()
        .toLowerCase();

    const cleanGuardianEmail =
      String(guardianEmail || "")
        .trim()
        .toLowerCase();

    const cleanRelationship =
      String(relationship || "").trim();

    const cleanPlan =
      String(plan || "") as GiftPlan;

    /* =========================================
       VALIDATION
    ========================================= */

    if (!cleanGifterName) {
      throw new Error(
        "Missing gifter name."
      );
    }

    if (!cleanGifterEmail) {
      throw new Error(
        "Missing gifter email."
      );
    }

    if (!cleanGuardianEmail) {
      throw new Error(
        "Missing guardian email."
      );
    }

    if (!cleanRelationship) {
      throw new Error(
        "Missing relationship."
      );
    }

    if (
      cleanPlan !== "gift-monthly" &&
      cleanPlan !== "gift-yearly"
    ) {
      throw new Error(
        "Invalid gift plan."
      );
    }

    /* =========================================
       SELECT STRIPE PRICE
    ========================================= */

    const isYearly =
      cleanPlan === "gift-yearly";

    const selectedPriceId =
      isYearly
        ? giftYearlyPriceId
        : giftMonthlyPriceId;

    const billingInterval =
      isYearly
        ? "yearly"
        : "monthly";

    const giftPrice =
      isYearly
        ? "49.99"
        : "4.99";

    /* =========================================
       STRIPE
    ========================================= */

    const stripe =
      new Stripe(secretKey);

    const metadata = {
      gifter_name:
        cleanGifterName,

      gifter_email:
        cleanGifterEmail,

      guardian_email:
        cleanGuardianEmail,

      relationship:
        cleanRelationship,

      progress_report_requested:
        String(
          Boolean(
            progressReportRequested
          )
        ),

      membership_type:
        "gift",

      gift_plan:
        cleanPlan,

      billing_interval:
        billingInterval,

      gift_price:
        giftPrice,
    };

    const cleanSiteUrl =
      siteUrl.replace(/\/$/, "");

    /* =========================================
       CREATE CHECKOUT SESSION

       NO TRIAL.
       NO $19.99 UPFRONT PRICE.
       ONE RECURRING GIFT PRICE ONLY.
    ========================================= */

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        /*
         * The GIFTER is the Stripe customer.
         * Billing and receipts go to them.
         */
        customer_email:
          cleanGifterEmail,

        line_items: [
          {
            price:
              selectedPriceId,

            quantity: 1,
          },
        ],

        /*
         * Metadata here is copied
         * onto the Stripe subscription.
         *
         * Notice there is NO:
         * trial_end
         * trial_period_days
         */
        subscription_data: {
          metadata,
        },

        /*
         * Metadata on the Checkout
         * Session itself as well.
         */
        metadata,

        success_url:
          `${cleanSiteUrl}/gift` +
          `?gift=success` +
          `&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${cleanSiteUrl}/gift` +
          `?gift=cancelled`,
      });

    if (!session.url) {
      throw new Error(
        "Stripe did not return a checkout URL."
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Gift checkout error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Gift checkout error";

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
