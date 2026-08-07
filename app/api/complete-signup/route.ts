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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sessionId =
      String(body.sessionId || "").trim();

    const password =
      String(body.password || "");

    if (!sessionId) {
      throw new Error(
        "Missing Stripe checkout session."
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
      session.mode !== "subscription" ||
      !session.subscription
    ) {
      throw new Error(
        "This Stripe checkout is not a valid membership."
      );
    }

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.email;

    if (!email) {
      throw new Error(
        "Unable to find the email for this checkout."
      );
    }

    const cleanEmail =
      email.trim().toLowerCase();

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id || null;

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id || null;

    const plan =
      session.metadata?.plan || "monthly";

    const {
      data: existingUsers,
      error: listError,
    } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      throw new Error(listError.message);
    }

    const existingUser =
      existingUsers.users.find(
        (user) =>
          user.email?.toLowerCase() ===
          cleanEmail
      );

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;

      const { error: updateUserError } =
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
        await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password,
          email_confirm: true,
        });

      if (
        createUserError ||
        !createdUser.user
      ) {
        throw new Error(
          createUserError?.message ||
            "Unable to create account."
        );
      }

      userId = createdUser.user.id;
    }

    const membershipStatus =
      plan === "yearly"
        ? "active"
        : "trialing";

    const { error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: userId,
            email: cleanEmail,
            stripe_customer_id: customerId,
            stripe_subscription_id:
              subscriptionId,
            membership_status:
              membershipStatus,
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

    if (subscriptionId) {
      await stripe.subscriptions.update(
        subscriptionId,
        {
          metadata: {
            ...session.metadata,
            user_id: userId,
            email: cleanEmail,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
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
