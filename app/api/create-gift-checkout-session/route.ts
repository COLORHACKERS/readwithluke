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
      userId,
      purchaserEmail,
      parentEmail,
      relationship,
      progressEmails,
      familyConfirmed,
    } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;

    // One-time $19.99 price
    const giftUpfrontPriceId =
      process.env.STRIPE_GIFT_PRICE_ID;

    // Recurring $4.99/month price
    const giftMonthlyPriceId =
      process.env.STRIPE_GIFT_MONTHLY_PRICE_ID;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!secretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    if (!giftUpfrontPriceId) {
      throw new Error("Missing STRIPE_GIFT_PRICE_ID");
    }

    if (!giftMonthlyPriceId) {
      throw new Error(
        "Missing STRIPE_GIFT_MONTHLY_PRICE_ID"
      );
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
        {
          error: "Family confirmation is required.",
        },
        {
          status: 400,
        }
      );
    }

    const stripe = new Stripe(secretKey);

    const cleanPurchaserEmail = String(
      purchaserEmail
    )
      .trim()
      .toLowerCase();

    const cleanParentEmail = String(parentEmail)
      .trim()
      .toLowerCase();

    const trialEnd = addCalendarMonths(
      new Date(),
      3
    );

    const metadata = {
      purchaser_user_id: String(userId),
      purchaser_email: cleanPurchaserEmail,
      parent_email: cleanParentEmail,
      relationship: String(relationship),
      progress_emails: String(
        Boolean(progressEmails)
      ),
      family_confirmed: "true",
      membership_type: "family_gift",
      gift_period: "3_months",
      renewal_price: "4.99_monthly",
    };

    const cleanSiteUrl = siteUrl.replace(/\/$/, "");

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email: cleanPurchaserEmail,
        payment_method_collection: "always",
        client_reference_id: String(userId),

        line_items: [
          {
            // Charged once today: $19.99
            price: giftUpfrontPriceId,
            quantity: 1,
          },
          {
            // First charged after three months:
            // $4.99/month
            price: giftMonthlyPriceId,
            quantity: 1,
          },
        ],

        subscription_data: {
          trial_end: Math.floor(
            trialEnd.getTime() / 1000
          ),

          metadata,
        },

        metadata,

        success_url:
          `${cleanSiteUrl}/dashboard` +
          `?gift=success` +
          `&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${cleanSiteUrl}/membership` +
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
    console.error("Gift checkout error:", error);

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
