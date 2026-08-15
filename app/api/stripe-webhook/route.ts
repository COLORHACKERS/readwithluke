import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

/* =========================================================
   CLIENTS
========================================================= */

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* =========================================================
   TYPES
========================================================= */

type ReaderPlan =
  | "monthly"
  | "partner30";

type GiftPlan =
  | "gift-monthly"
  | "gift-yearly";

type GiftMetadata = {
  gifter_name: string;
  gifter_email: string;
  guardian_email: string;
  relationship: string;
  progress_report_requested: string;
  membership_type: string;
  gift_plan?: string;
  billing_interval?: string;
  gift_price?: string;
};

/* =========================================================
   HELPERS
========================================================= */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatRelationship(
  relationship: string
) {
  const labels: Record<string, string> = {
    grandparent: "grandparent",
    aunt: "aunt",
    uncle: "uncle",
    godparent: "godparent",
    parent: "parent",
    family_friend: "family friend",
    family_member: "family member",
    other: "loved one",
  };

  return (
    labels[relationship] ||
    relationship.replace(/_/g, " ")
  );
}

/* =========================================================
   REGULAR MEMBERSHIP WELCOME EMAIL
========================================================= */

async function sendWelcomeEmail({
  email,
  readerName,
  plan,
}: {
  email: string;
  readerName?: string | null;
  plan: ReaderPlan;
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
        Unless you cancel before the 30-day pass ends,
        your membership will automatically continue at
        <strong>$4.99 per month</strong>.
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
        <strong>$4.99 per month</strong>.
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
          Hi ${escapeHtml(readerName || "Friend")},
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

/* =========================================================
   GIFTER THANK-YOU EMAIL
========================================================= */

async function sendGifterThankYouEmail({
  gifterEmail,
  gifterName,
  guardianEmail,
  progressReportRequested,
  giftPlan,
}: {
  gifterEmail: string;
  gifterName: string;
  guardianEmail: string;
  progressReportRequested: boolean;
  giftPlan: GiftPlan;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.readwithluke.com";

  const safeName =
    escapeHtml(gifterName);

  const safeGuardianEmail =
    escapeHtml(guardianEmail);

  const isYearly =
    giftPlan === "gift-yearly";

  const priceLabel =
    isYearly
      ? "$49.99/year"
      : "$4.99/month";

  const planLabel =
    isYearly
      ? "yearly"
      : "monthly";

  await resend.emails.send({
    from:
      "Read With Luke <hello@readwithluke.com>",

    to: gifterEmail,

    subject:
      "🎁 Your Read With Luke Gift Is On Its Way!",

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
          THANK YOU FOR GIFTING READING
        </p>

        <h1 style="
          color:#13294B;
          font-size:38px;
          line-height:1.05;
        ">
          Your gift is on its way!
        </h1>

        <p>
          Hi ${safeName},
        </p>

        <p>
          Thank you for gifting
          <strong>Read With Luke</strong>.
          You just gave a child access to
          stories, learning adventures,
          activities and rewards.
        </p>

        <p>
          We sent the gift invitation to:
          <br />
          <strong>${safeGuardianEmail}</strong>
        </p>

        <p>
          You selected the
          <strong>${planLabel} gift membership</strong>
          at
          <strong>${priceLabel}</strong>.
        </p>

        <p>
          Your gift membership begins today and
          will automatically renew at
          <strong>${priceLabel}</strong>
          until canceled.
        </p>

        ${
          progressReportRequested
            ? `
              <div style="
                margin:24px 0;
                padding:18px;
                background:#FFF3D6;
                border-radius:16px;
              ">
                <strong>
                  Monthly report card requested
                </strong>

                <p style="
                  margin:8px 0 0;
                  line-height:1.5;
                ">
                  The parent or guardian will be
                  asked whether they approve sharing
                  the child's monthly Read With Luke
                  report card with you.
                </p>

                <p style="
                  margin:8px 0 0;
                  font-size:13px;
                  color:#666;
                ">
                  Nothing will be shared unless
                  the guardian approves.
                </p>
              </div>
            `
            : ""
        }

        <p>
          Stripe will separately send your
          payment receipt and billing information.
        </p>

        <p style="margin-top:32px;">
          <a
            href="${siteUrl}"
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
            Visit Read With Luke →
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
          Thank you for sharing the adventure. 📚
          <br />
          <strong>
            The Read With Luke Team
          </strong>
        </p>
      </div>
    `,
  });
}

/* =========================================================
   GUARDIAN GIFT ACTIVATION EMAIL
========================================================= */

async function sendGiftActivationEmail({
  guardianEmail,
  gifterName,
  relationship,
  activationToken,
  progressReportRequested,
  giftPlan,
}: {
  guardianEmail: string;
  gifterName: string;
  relationship: string;
  activationToken: string;
  progressReportRequested: boolean;
  giftPlan: GiftPlan;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.readwithluke.com";

  const activationUrl =
    `${siteUrl}/activate-gift?token=` +
    encodeURIComponent(
      activationToken
    );

  const safeGifterName =
    escapeHtml(gifterName);

  const safeGuardianEmail =
    escapeHtml(guardianEmail);

  const safeRelationship =
    escapeHtml(
      formatRelationship(
        relationship
      )
    );

  const giftAccessText =
    giftPlan === "gift-yearly"
      ? "a full year of Read With Luke access"
      : "a Read With Luke monthly membership";

  await resend.emails.send({
    from:
      "Read With Luke <hello@readwithluke.com>",

    to: guardianEmail,

    subject:
      `🎁 ${gifterName} gifted your child Read With Luke!`,

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
          A SPECIAL READING GIFT
        </p>

        <h1 style="
          color:#13294B;
          font-size:38px;
          line-height:1.05;
        ">
          Reading adventures are waiting!
        </h1>

        <p>
          <strong>${safeGifterName}</strong>,
          your child's ${safeRelationship},
          gifted your child
          <strong>Read With Luke!</strong>
        </p>

        <p>
          Your child received
          <strong>${giftAccessText}</strong>
          with illustrated stories, playful
          learning adventures, activities,
          coins and rewards.
        </p>

        <p>
          To get started, create your parent or
          guardian account and choose your password.
        </p>

        <p>
          <strong>
            You will not be asked for payment
            information.
          </strong>
        </p>

        ${
          progressReportRequested
            ? `
              <div style="
                margin:24px 0;
                padding:18px;
                background:#FFF3D6;
                border-radius:16px;
              ">
                <strong>
                  A monthly report card was requested
                </strong>

                <p style="
                  margin:8px 0 0;
                  line-height:1.5;
                ">
                  ${safeGifterName} requested to
                  receive a monthly Read With Luke
                  report card.
                </p>

                <p style="
                  margin:8px 0 0;
                  line-height:1.5;
                ">
                  After you activate the account,
                  we'll ask whether you want to
                  approve or decline that request.
                  Nothing is shared without your
                  permission.
                </p>
              </div>
            `
            : ""
        }

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
            Activate Your Gift →
          </a>
        </p>

        <hr style="
          margin:40px 0;
          border:none;
          border-top:1px solid #ddd;
        ">

        <p style="
          color:#666;
          font-size:13px;
          line-height:1.6;
        ">
          This invitation was sent to
          ${safeGuardianEmail}.
          <br /><br />

          <strong>
            The Read With Luke Team
          </strong>
        </p>
      </div>
    `,
  });
}

/* =========================================================
   REGULAR 7-DAY / 30-DAY CHECKOUT
========================================================= */

async function handleRegularCheckout(
  session: Stripe.Checkout.Session
) {
  const plan: ReaderPlan =
    session.metadata?.plan === "partner30"
      ? "partner30"
      : "monthly";

  const email =
    session.customer_details?.email ||
    session.customer_email ||
    session.metadata?.email ||
    null;

  const userId =
    session.metadata?.user_id ||
    session.client_reference_id ||
    null;

  /*
   * Stripe-first signup:
   * there may not be a Supabase user yet.
   */
  if (!userId) {
    if (email) {
      await sendWelcomeEmail({
        email,
        plan,
      });
    }

    console.log(
      `Checkout completed for ${plan}. Waiting for complete-signup to create the Supabase user.`
    );

    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ||
        null;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ||
        null;

  let membershipStatus =
    "trialing";

  let trialEnd:
    | string
    | null = null;

  if (subscriptionId) {
    const subscription =
      await stripe.subscriptions.retrieve(
        subscriptionId
      );

    membershipStatus =
      subscription.status;

    trialEnd =
      subscription.trial_end
        ? new Date(
            subscription.trial_end *
              1000
          ).toISOString()
        : null;
  }

  const {
    data: profile,
    error: profileError,
  } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, full_name, email, welcome_email_sent"
    )
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      profileError.message
    );
  }

  const { error: updateError } =
    await supabaseAdmin
      .from("profiles")
      .update({
        stripe_customer_id:
          customerId,

        stripe_subscription_id:
          subscriptionId,

        membership_status:
          membershipStatus,

        trial_end:
          trialEnd,
      })
      .eq("id", userId);

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  const accountEmail =
    profile?.email ||
    email;

  if (
    accountEmail &&
    !profile?.welcome_email_sent
  ) {
    await sendWelcomeEmail({
      email: accountEmail,

      readerName:
        profile?.full_name,

      plan,
    });

    await supabaseAdmin
      .from("profiles")
      .update({
        welcome_email_sent:
          true,
      })
      .eq("id", userId);
  }
}

/* =========================================================
   GIFT CHECKOUT
========================================================= */

async function handleGiftCheckout(
  session: Stripe.Checkout.Session
) {
  const metadata =
    session.metadata as GiftMetadata | null;

  if (!metadata) {
    throw new Error(
      "Gift checkout is missing metadata."
    );
  }

  const gifterName =
    metadata.gifter_name?.trim();

  const gifterEmail =
    (
      metadata.gifter_email ||
      session.customer_details?.email ||
      session.customer_email ||
      ""
    )
      .trim()
      .toLowerCase();

  const guardianEmail =
    metadata.guardian_email
      ?.trim()
      .toLowerCase();

  const relationship =
    metadata.relationship?.trim();

  const progressReportRequested =
    metadata.progress_report_requested ===
    "true";

  const giftPlan: GiftPlan | null =
    metadata.gift_plan ===
    "gift-monthly"
      ? "gift-monthly"
      : metadata.gift_plan ===
          "gift-yearly"
        ? "gift-yearly"
        : null;

  if (!gifterName) {
    throw new Error(
      "Gift checkout is missing gifter name."
    );
  }

  if (!gifterEmail) {
    throw new Error(
      "Gift checkout is missing gifter email."
    );
  }

  if (!guardianEmail) {
    throw new Error(
      "Gift checkout is missing guardian email."
    );
  }

  if (!relationship) {
    throw new Error(
      "Gift checkout is missing relationship."
    );
  }

  if (!giftPlan) {
    throw new Error(
      "Gift checkout is missing a valid gift plan."
    );
  }

  const customerId =
    typeof session.customer ===
    "string"
      ? session.customer
      : session.customer?.id ||
        null;

  const subscriptionId =
    typeof session.subscription ===
    "string"
      ? session.subscription
      : session.subscription?.id ||
        null;

  if (!subscriptionId) {
    throw new Error(
      "Gift checkout is missing subscription ID."
    );
  }

  const activationToken =
    randomUUID();

  const {
    data: gift,
    error: giftError,
  } = await supabaseAdmin
    .from("gift_memberships")
    .upsert(
      {
        purchaser_user_id:
          null,

        purchaser_name:
          gifterName,

        purchaser_email:
          gifterEmail,

        parent_email:
          guardianEmail,

        relationship,

        progress_report_requested:
          progressReportRequested,

        progress_report_approved:
          false,

        stripe_customer_id:
          customerId,

        stripe_subscription_id:
          subscriptionId,

        activation_token:
          activationToken,

        status:
          "pending",
      },
      {
        onConflict:
          "stripe_subscription_id",
      }
    )
    .select(
      "id, activation_token"
    )
    .single();

  if (giftError) {
    throw new Error(
      giftError.message
    );
  }

  /* EMAIL #1 — GIFTER */

  await sendGifterThankYouEmail({
    gifterEmail,
    gifterName,
    guardianEmail,
    progressReportRequested,
    giftPlan,
  });

  /* EMAIL #2 — GUARDIAN */

  await sendGiftActivationEmail({
    guardianEmail,
    gifterName,
    relationship,

    activationToken:
      gift.activation_token,

    progressReportRequested,
    giftPlan,
  });
}

/* =========================================================
   SUBSCRIPTION UPDATED
========================================================= */

async function updateSubscriptionStatus(
  subscription: Stripe.Subscription
) {
  const customerId =
    typeof subscription.customer ===
    "string"
      ? subscription.customer
      : subscription.customer.id;

  const { data: gift } =
    await supabaseAdmin
      .from("gift_memberships")
      .select("id")
      .eq(
        "stripe_subscription_id",
        subscription.id
      )
      .maybeSingle();

  /*
   * GIFT SUBSCRIPTION
   */
  if (gift) {
    await supabaseAdmin
      .from("gift_memberships")
      .update({
        status:
          subscription.status,
      })
      .eq("id", gift.id);

    return;
  }

  /*
   * REGULAR MEMBERSHIP
   */
  await supabaseAdmin
    .from("profiles")
    .update({
      membership_status:
        subscription.status,

      stripe_subscription_id:
        subscription.id,

      trial_end:
        subscription.trial_end
          ? new Date(
              subscription.trial_end *
                1000
            ).toISOString()
          : null,
    })
    .eq(
      "stripe_customer_id",
      customerId
    );
}

/* =========================================================
   SUBSCRIPTION CANCELLED
========================================================= */

async function cancelSubscription(
  subscription: Stripe.Subscription
) {
  const customerId =
    typeof subscription.customer ===
    "string"
      ? subscription.customer
      : subscription.customer.id;

  const { data: gift } =
    await supabaseAdmin
      .from("gift_memberships")
      .select("id")
      .eq(
        "stripe_subscription_id",
        subscription.id
      )
      .maybeSingle();

  /*
   * GIFT SUBSCRIPTION
   */
  if (gift) {
    const {
      data: giftDetails,
    } = await supabaseAdmin
      .from("gift_memberships")
      .select(
        "id, parent_user_id"
      )
      .eq(
        "id",
        gift.id
      )
      .single();

    await supabaseAdmin
      .from("gift_memberships")
      .update({
        status:
          "cancelled",
      })
      .eq(
        "id",
        gift.id
      );

    if (
      giftDetails?.parent_user_id
    ) {
      await supabaseAdmin
        .from("profiles")
        .update({
          membership_status:
            "cancelled",
        })
        .eq(
          "id",
          giftDetails.parent_user_id
        );
    }

    return;
  }

  /*
   * REGULAR MEMBERSHIP
   */
  await supabaseAdmin
    .from("profiles")
    .update({
      membership_status:
        "cancelled",
    })
    .eq(
      "stripe_customer_id",
      customerId
    );
}

/* =========================================================
   STRIPE WEBHOOK
========================================================= */

export async function POST(
  req: Request
) {
  const body =
    await req.text();

  const signature =
    req.headers.get(
      "stripe-signature"
    );

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Missing Stripe signature.",
      },
      {
        status: 400,
      }
    );
  }

  let event:
    Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        process.env
          .STRIPE_WEBHOOK_SECRET!
      );
  } catch (error) {
    console.error(
      "Webhook signature error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Invalid webhook signature.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    switch (event.type) {
      /* =====================================
         CHECKOUT COMPLETED
      ===================================== */

      case "checkout.session.completed": {
        const session =
          event.data
            .object as Stripe.Checkout.Session;

        if (
          session.metadata
            ?.membership_type ===
          "gift"
        ) {
          await handleGiftCheckout(
            session
          );
        } else {
          await handleRegularCheckout(
            session
          );
        }

        break;
      }

      /* =====================================
         SUBSCRIPTION UPDATED
      ===================================== */

      case "customer.subscription.updated": {
        const subscription =
          event.data
            .object as Stripe.Subscription;

        await updateSubscriptionStatus(
          subscription
        );

        break;
      }

      /* =====================================
         SUBSCRIPTION CANCELLED
      ===================================== */

      case "customer.subscription.deleted": {
        const subscription =
          event.data
            .object as Stripe.Subscription;

        await cancelSubscription(
          subscription
        );

        break;
      }

      default:
        break;
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      `Webhook processing failed for ${event.type}:`,
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Webhook processing failed.";

    return NextResponse.json(
      {
        error:
          message,
      },
      {
        status: 500,
      }
    );
  }
}
