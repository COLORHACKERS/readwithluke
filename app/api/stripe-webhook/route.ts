import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type GiftMetadata = {
  purchaser_user_id: string;
  purchaser_email: string;
  parent_email: string;
  relationship: string;
  progress_emails: string;
  family_confirmed: string;
  membership_type: string;
};

async function sendWelcomeEmail({
  email,
  readerName,
  plan,
}: {
  email: string;
  readerName?: string | null;
  plan: "monthly" | "yearly" | "partner30";
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.readwithluke.com";

  let subject = "";
  let headline = "";
  let mainMessage = "";
  let billingMessage = "";

  if (plan === "partner30") {
    subject =
      "🎉 Your 30-Day Read With Luke Partner Pass Has Started!";

    headline =
      "Your 30-Day Partner Pass Is Ready!";

    mainMessage = `
      <p>
        <strong>
          Your private 30-day Read With Luke Partner Pass
          has officially begun! 🎉
        </strong>
      </p>

      <p>
        Your family now has unlimited access to the
        Read With Luke library, including beautifully
        illustrated stories and learning adventures.
      </p>

      <p>
        Your payment method has been securely saved,
        but you will not be charged during your
        30-day pass.
      </p>
    `;

    billingMessage = `
      <p>
        Unless you cancel before the 30 days end,
        your membership will automatically continue
        at <strong>$9.99 per month</strong>.
      </p>
    `;
  } else if (plan === "yearly") {
    subject =
      "🎉 Welcome to Your Read With Luke Yearly Membership!";

    headline =
      "Your Year of Adventures Has Started!";

    mainMessage = `
      <p>
        <strong>
          Your Read With Luke yearly membership is
          officially active! 🎉
        </strong>
      </p>

      <p>
        Your family now has unlimited access to the
        Read With Luke library, including stories
        and learning adventures.
      </p>
    `;

    billingMessage = `
      <p>
        Your yearly membership will renew at
        <strong>$69.99 per year</strong> unless
        canceled before your renewal date.
      </p>
    `;
  } else {
    subject =
      "🎉 Your 7-Day Read With Luke Free Trial Has Started!";

    headline =
      "Welcome to Read With Luke!";

    mainMessage = `
      <p>
        <strong>
          Your 7-day free trial has officially begun! 🎉
        </strong>
      </p>

      <p>
        Your family now has unlimited access to the
        Read With Luke library, filled with beautifully
        illustrated stories and learning adventures.
      </p>

      <p>
        Your payment method has been securely saved,
        but you will not be charged during your
        free trial.
      </p>
    `;

    billingMessage = `
      <p>
        Unless you cancel before the 7-day trial ends,
        your membership will automatically continue at
        <strong>$9.99 per month</strong>.
      </p>
    `;
  }

  await resend.emails.send({
    from:
      "Read With Luke <hello@readwithluke.com>",

    to: email,

    subject,

    html: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:600px;
        margin:auto;
        padding:40px;
        background:#F8F1E6;
        border-radius:24px;
      ">
        <h1 style="
          color:#13294B;
          font-size:38px;
          line-height:1.05;
        ">
          ${headline}
        </h1>

        <p>
          Hi ${readerName || "Friend"},
        </p>

        ${mainMessage}

        ${billingMessage}

        <p style="margin-top:32px;">
          <a
            href="${siteUrl}/library"
            style="
              background:#FF5526;
              color:white;
              text-decoration:none;
              padding:16px 28px;
              border-radius:999px;
              font-weight:bold;
              display:inline-block;
            "
          >
            Start Reading →
          </a>
        </p>

        <hr style="
          margin:40px 0;
          border:none;
          border-top:1px solid #ddd;
        ">

        <p style="
          color:#666;
          font-size:14px;
          line-height:1.6;
        ">
          Happy Reading! 📚
          <br />
          <strong>
            The Read With Luke Team
          </strong>
        </p>
      </div>
    `,
  });
}
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  await resend.emails.send({
    from: "Read With Luke <hello@readwithluke.com>",
    to: email,
    subject: "🎉 Welcome to Read With Luke!",
    html: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:600px;
        margin:auto;
        padding:40px;
        background:#F8F1E6;
        border-radius:24px;
      ">
        <h1 style="color:#13294B;">Welcome to Read With Luke!</h1>

        <p>Hi ${readerName || "Friend"},</p>

        <p>
          <strong>Your 7-day free trial has officially begun! 🎉</strong>
        </p>

        <p>
          Your family now has unlimited access to the Read With Luke library,
          filled with beautifully illustrated stories and learning adventures.
        </p>

        <p>
          Your payment method has been securely saved, but you will not be
          charged during your free trial.
        </p>

        <p>
          Unless you cancel before the 7-day trial ends, your membership will
          automatically continue at <strong>$9.99 per month</strong>.
        </p>

        <p style="margin-top:32px;">
          <a
            href="${siteUrl}/library"
            style="
              background:#FF5526;
              color:white;
              text-decoration:none;
              padding:16px 28px;
              border-radius:999px;
              font-weight:bold;
              display:inline-block;
            "
          >
            Start Reading →
          </a>
        </p>

        <hr style="margin:40px 0;border:none;border-top:1px solid #ddd;">

        <p style="color:#666;font-size:14px;line-height:1.6;">
          Happy Reading! 📚
          <br />
          <strong>The Read With Luke Team</strong>
        </p>
      </div>
    `,
  });
}

async function sendGiftActivationEmail({
  parentEmail,
  purchaserEmail,
  relationship,
  activationToken,
}: {
  parentEmail: string;
  purchaserEmail: string;
  relationship: string;
  activationToken: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const activationUrl =
    `${siteUrl}/activate-gift?token=${encodeURIComponent(activationToken)}`;

  await resend.emails.send({
    from: "Read With Luke <hello@readwithluke.com>",
    to: parentEmail,
    subject: "🎁 Your family sent you Read With Luke!",
    html: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:600px;
        margin:auto;
        padding:40px;
        background:#F8F1E6;
        border-radius:24px;
      ">
        <p style="
          color:#FF5526;
          font-size:13px;
          font-weight:bold;
          letter-spacing:.08em;
        ">
          A FAMILY GIFT
        </p>

        <h1 style="color:#13294B;font-size:38px;line-height:1.05;">
          Reading adventures are waiting!
        </h1>

        <p>
          A ${relationship.replace("_", " ")} has gifted your child access to
          Read With Luke.
        </p>

        <p>
          The gift was purchased by
          <strong>${purchaserEmail}</strong>.
        </p>

        <p>
          Activate the gift using your parent or guardian account. You will not
          be asked for payment information.
        </p>

        <p style="margin-top:32px;">
          <a
            href="${activationUrl}"
            style="
              background:#FF5526;
              color:white;
              text-decoration:none;
              padding:16px 28px;
              border-radius:999px;
              font-weight:bold;
              display:inline-block;
            "
          >
            Activate Gift →
          </a>
        </p>

        <hr style="margin:40px 0;border:none;border-top:1px solid #ddd;">

        <p style="color:#666;font-size:13px;line-height:1.6;">
          This invitation was sent to ${parentEmail}.
          <br /><br />
          <strong>The Read With Luke Team</strong>
        </p>
      </div>
    `,
  });
}

async function handleRegularCheckout(
  session: Stripe.Checkout.Session
) {
  const plan =
  session.metadata?.plan === "partner30"
    ? "partner30"
    : session.metadata?.plan === "yearly"
      ? "yearly"
      : "monthly";
  const userId =
    session.metadata?.user_id ||
    session.client_reference_id;

  if (!userId) {
    throw new Error("Regular checkout is missing user ID.");
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || null;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id || null;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, welcome_email_sent")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      membership_status: "trialing",
      trial_end: null,
    })
    .eq("id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const email =
    profile?.email ||
    session.customer_details?.email ||
    session.customer_email;

  if (email && !profile?.welcome_email_sent) {
   await sendWelcomeEmail({
  email,
  readerName: profile?.full_name,
  plan,
});

    await supabaseAdmin
      .from("profiles")
      .update({
        welcome_email_sent: true,
      })
      .eq("id", userId);
  }
}

async function handleGiftCheckout(
  session: Stripe.Checkout.Session
) {
  const metadata = session.metadata as GiftMetadata | null;

  if (!metadata) {
    throw new Error("Gift checkout is missing metadata.");
  }

  const purchaserUserId =
    metadata.purchaser_user_id ||
    session.client_reference_id;

  const purchaserEmail =
    metadata.purchaser_email ||
    session.customer_details?.email ||
    session.customer_email;

  const parentEmail =
    metadata.parent_email?.trim().toLowerCase();

  const relationship = metadata.relationship;

  if (!purchaserUserId) {
    throw new Error("Gift checkout is missing purchaser user ID.");
  }

  if (!purchaserEmail) {
    throw new Error("Gift checkout is missing purchaser email.");
  }

  if (!parentEmail) {
    throw new Error("Gift checkout is missing parent email.");
  }

  if (!relationship) {
    throw new Error("Gift checkout is missing relationship.");
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || null;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id || null;

  const activationToken = randomUUID();

  const { data: gift, error: giftError } = await supabaseAdmin
    .from("gift_memberships")
    .upsert(
      {
        purchaser_user_id: purchaserUserId,
        purchaser_email: purchaserEmail.trim().toLowerCase(),
        parent_email: parentEmail,
        relationship,
        progress_emails_enabled:
          metadata.progress_emails === "true",
        family_confirmed:
          metadata.family_confirmed === "true",
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        activation_token: activationToken,
        status: "pending",
      },
      {
        onConflict: "stripe_subscription_id",
      }
    )
    .select("id, activation_token")
    .single();

  if (giftError) {
    throw new Error(giftError.message);
  }

  await sendGiftActivationEmail({
    parentEmail,
    purchaserEmail,
    relationship,
    activationToken: gift.activation_token,
  });
}

async function updateSubscriptionStatus(
  subscription: Stripe.Subscription
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const { data: gift } = await supabaseAdmin
    .from("gift_memberships")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (gift) {
    await supabaseAdmin
      .from("gift_memberships")
      .update({
        status: subscription.status,
      })
      .eq("id", gift.id);

    return;
  }

  await supabaseAdmin
    .from("profiles")
    .update({
      membership_status: subscription.status,
      stripe_subscription_id: subscription.id,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
    })
    .eq("stripe_customer_id", customerId);
}

async function cancelSubscription(
  subscription: Stripe.Subscription
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const { data: gift } = await supabaseAdmin
    .from("gift_memberships")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (gift) {
  const { data: giftDetails } = await supabaseAdmin
    .from("gift_memberships")
    .select("id, parent_user_id")
    .eq("id", gift.id)
    .single();

  await supabaseAdmin
    .from("gift_memberships")
    .update({
      status: "cancelled",
    })
    .eq("id", gift.id);

  if (giftDetails?.parent_user_id) {
    await supabaseAdmin
      .from("profiles")
      .update({
        membership_status: "cancelled",
      })
      .eq("id", giftDetails.parent_user_id);
  }

  return;
}

  await supabaseAdmin
    .from("profiles")
    .update({
      membership_status: "cancelled",
    })
    .eq("stripe_customer_id", customerId);
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature error:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session =
          event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.membership_type === "gift") {
          await handleGiftCheckout(session);
        } else {
          await handleRegularCheckout(session);
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        await updateSubscriptionStatus(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        await cancelSubscription(subscription);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Webhook processing failed for ${event.type}:`, error);

    const message =
      error instanceof Error
        ? error.message
        : "Webhook processing failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
