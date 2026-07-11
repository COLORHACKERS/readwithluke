import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("authorization");
    const accessToken = authorization?.replace("Bearer ", "").trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Please sign in before activating the gift." },
        { status: 401 }
      );
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing gift activation token." },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "Your login session is invalid. Please sign in again." },
        { status: 401 }
      );
    }

    const { data: gift, error: giftError } = await supabaseAdmin
      .from("gift_memberships")
      .select(
        `
          id,
          parent_email,
          parent_user_id,
          status,
          stripe_customer_id,
          stripe_subscription_id
        `
      )
      .eq("activation_token", token)
      .maybeSingle();

    if (giftError) {
      throw new Error(giftError.message);
    }

    if (!gift) {
      return NextResponse.json(
        { error: "This gift invitation could not be found." },
        { status: 404 }
      );
    }

    const signedInEmail = user.email.trim().toLowerCase();
    const invitedEmail = gift.parent_email.trim().toLowerCase();

    if (signedInEmail !== invitedEmail) {
      return NextResponse.json(
        {
          error: `Please sign in using the invited parent email: ${gift.parent_email}`,
        },
        { status: 403 }
      );
    }

    if (gift.parent_user_id && gift.parent_user_id !== user.id) {
      return NextResponse.json(
        { error: "This gift has already been claimed by another account." },
        { status: 409 }
      );
    }

    if (gift.status === "cancelled") {
      return NextResponse.json(
        { error: "This gift membership is no longer active." },
        { status: 410 }
      );
    }

    const now = new Date().toISOString();

    const { error: activationError } = await supabaseAdmin
      .from("gift_memberships")
      .update({
        parent_user_id: user.id,
        status: "active",
        activated_at: now,
      })
      .eq("id", gift.id);

    if (activationError) {
      throw new Error(activationError.message);
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        membership_status: "active",
        stripe_customer_id: gift.stripe_customer_id,
        stripe_subscription_id: gift.stripe_subscription_id,
      })
      .eq("id", user.id);

    if (profileError) {
      throw new Error(profileError.message);
    }

    return NextResponse.json({
      success: true,
      message: "Your Read With Luke gift is active!",
    });
  } catch (error) {
    console.error("Activate gift error:", error);

    const message =
      error instanceof Error ? error.message : "Could not activate gift.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
