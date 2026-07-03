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

async function sendWelcomeEmail({
  email,
  readerName,
}: {
  email: string;
  readerName?: string | null;
}) {
  await resend.emails.send({
    from: "Read With Luke <hello@readwithluke.com>",
    to: email,
    subject: "🎉 Welcome to Read With Luke!",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:40px;background:#F8F1E6;border-radius:24px;">
        <h1 style="color:#13294B;">Welcome to Read With Luke!</h1>

        <p>Hi ${readerName || "Friend"},</p>

        <p>Your account has been created successfully.</p>

        <p><strong>Your 7-day free trial has begun.</strong></p>

        <p>You're ready to discover amazing stories and learning adventures together.</p>

        <p style="margin-top:32px;">
          <a
            href="${process.env.NEXT_PUBLIC_SITE_URL}/library"
            style="
              background:#FF5526;
              color:white;
              text-decoration:none;
              padding:16px 28px;
              border-radius:999px;
              font-weight:bold;
              display:inline-block;
            ">
            Start Reading →
          </a>
        </p>

        <hr style="margin:40px 0;border:none;border-top:1px solid #ddd;">

        <p style="color:#666;font-size:14px;">
          Thanks for joining the adventure! 📚
        </p>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
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
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.user_id || session.client_reference_id;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, email, welcome_email_sent")
        .eq("id", userId)
        .single();

      await supabaseAdmin
        .from("profiles")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          membership_status: "trialing",
          trial_end: null,
        })
        .eq("id", userId);

      const email =
        profile?.email ||
        session.customer_details?.email ||
        session.customer_email;

      if (email && !profile?.welcome_email_sent) {
        await sendWelcomeEmail({
          email,
          readerName: profile?.full_name,
        });

        await supabaseAdmin
          .from("profiles")
          .update({
            welcome_email_sent: true,
          })
          .eq("id", userId);
      }
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    await supabaseAdmin
      .from("profiles")
      .update({
        membership_status: subscription.status,
        stripe_subscription_id: subscription.id,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
      })
      .eq("stripe_customer_id", subscription.customer as string);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await supabaseAdmin
      .from("profiles")
      .update({
        membership_status: "cancelled",
      })
      .eq("stripe_customer_id", subscription.customer as string);
  }

  return NextResponse.json({ received: true });
}
