import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const sessionId = String(
      body.sessionId || ""
    ).trim();

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password || ""
    );

    if (!sessionId) {
      throw new Error(
        "Missing Stripe checkout session."
      );
    }

    if (!email) {
      throw new Error(
        "Missing account email."
      );
    }

    if (password.length < 6) {
      throw new Error(
        "Password must be at least 6 characters."
      );
    }

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
      );

    if (
      session.mode !== "subscription"
    ) {
      throw new Error(
        "This is not a valid membership checkout."
      );
    }

    if (!session.subscription) {
      throw new Error(
        "Stripe did not create a subscription."
      );
    }

    const stripeEmail =
      (
        session.customer_details?.email ||
        session.customer_email ||
        session.metadata?.email ||
        ""
      )
        .trim()
        .toLowerCase();

    if (!stripeEmail) {
      throw new Error(
        "Unable to verify the Stripe email."
      );
    }

    if (stripeEmail !== email) {
      throw new Error(
        "The signup email does not match the Stripe checkout."
      );
    }

    const plan =
      session.metadata?.plan === "partner30"
        ? "partner30"
        : session.metadata?.plan === "yearly"
          ? "yearly"
          : "monthly";

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id || null;

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id || null;

    if (!subscriptionId) {
      throw new Error(
        "Missing Stripe subscription ID."
      );
    }

    const subscription =
      await stripe.subscriptions.retrieve(
        subscriptionId
      );

    const membershipStatus =
      subscription.status;

    const trialEnd =
      subscription.trial_end
        ? new Date(
            subscription.trial_end * 1000
          ).toISOString()
        : null;

    const {
      data: existingUsers,
      error: listError,
    } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      throw new Error(
        listError.message
      );
    }

    const existingUser =
      existingUsers.users.find(
        (user) =>
          user.email?.toLowerCase() ===
          email
      );

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;

      const {
        error: updateUserError,
      } =
        await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          {
            password,
            email_confirm: true,
          }
        );

      if (updateUserError) {
        throw new Error(
          updateUserError.message
        );
      }
    } else {
      const {
        data: createdUser,
        error: createUserError,
      } =
        await supabaseAdmin.auth.admin.createUser(
          {
            email,
            password,
            email_confirm: true,
          }
        );

      if (
        createUserError ||
        !createdUser.user
      ) {
        throw new Error(
          createUserError?.message ||
            "Unable to create account."
        );
      }

      userId =
        createdUser.user.id;
    }

    const {
      error: profileError,
    } =
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: userId,
            email,
            stripe_customer_id:
              customerId,
            stripe_subscription_id:
              subscriptionId,
            membership_status:
              membershipStatus,
            trial_end: trialEnd,
          },
          {
            onConflict: "id",
          }
        );

    if (profileError) {
      throw new Error(
        profileError.message
      );
    }

    await stripe.subscriptions.update(
      subscriptionId,
      {
        metadata: {
          ...subscription.metadata,
          user_id: userId,
          email,
          plan,
        },
      }
    );

    return NextResponse.json({
      success: true,
      userId,
      plan,
    });
  } catch (error) {
    console.error(
      "Complete signup error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to complete signup.",
      },
      {
        status: 500,
      }
    );
  }
}
