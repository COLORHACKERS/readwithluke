import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Adds calendar months while preventing dates such as January 31
 * from rolling too far into the following month.
 */
function addCalendarMonths(date: Date, months: number) {
  const result = new Date(date);
  const originalDay = result.getUTCDate();

  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);

  const lastDayOfTargetMonth = new Date(
    Date.UTC(
      result.getUTCFullYear(),
      result.getUTCMonth() + 1,
      0
    )
  ).getUTCDate();

  result.setUTCDate(
    Math.min(originalDay, lastDayOfTargetMonth)
  );

  return result;
}

export async function POST(req: Request) {
  try {
    const {
      gifterName,
      gifterEmail,
      guardianEmail,
      relationship,
      progressReportRequested,
    } = await req.json();

    const secretKey =
      process.env.STRIPE_SECRET_KEY;

    const giftUpfrontPriceId =
      process.env.STRIPE_GIFT_PRICE_ID;

    const giftMonthlyPriceId =
      process.env.STRIPE_GIFT_MONTHLY_PRICE_ID;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL;

    if (!secretKey) {
      throw new Error(
        "Missing STRIPE_SECRET_KEY"
      );
    }

    if (!giftUpfrontPriceId) {
      throw new Error(
        "Missing STRIPE_GIFT_PRICE_ID"
      );
    }

    if (!giftMonthlyPriceId) {
      throw new Error(
        "Missing STRIPE_GIFT_MONTHLY_PRICE_ID"
      );
    }

    if (!siteUrl) {
      throw new Error(
        "Missing NEXT_PUBLIC_SITE_URL"
      );
    }

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

    const stripe =
      new Stripe(secretKey);

    const trialEnd =
      addCalendarMonths(
        new Date(),
        3
      );

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

      gift_period:
        "3_months",

      renewal_price:
        "4.99_monthly",
    };

    const cleanSiteUrl =
      siteUrl.replace(/\/$/, "");

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        /*
         * IMPORTANT:
         * The GIFTER is the Stripe customer.
         *
         * Receipts, invoices and billing
         * information go to this email.
         */
        customer_email:
          cleanGifterEmail,

        payment_method_collection:
          "always",

        line_items: [
          {
            /*
             * Charged immediately:
             * $19.99 gift purchase
             */
            price:
              giftUpfrontPriceId,

            quantity: 1,
          },
          {
            /*
             * Recurring:
             * $4.99/month
             *
             * First charged after the
             * 3 included months.
             */
            price:
              giftMonthlyPriceId,

            quantity: 1,
          },
        ],

        subscription_data: {
          trial_end:
            Math.floor(
              trialEnd.getTime() /
                1000
            ),

          metadata,
        },

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
