import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const authorization =
      req.headers.get("authorization");

    const accessToken =
      authorization
        ?.replace("Bearer ", "")
        .trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Please sign in before claiming this gift.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const token =
      String(
        body.token || ""
      ).trim();

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Missing gift activation token.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VERIFY LOGGED-IN GUARDIAN
    ===================================================== */

    const {
      data: { user },
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(
        accessToken
      );

    if (
      userError ||
      !user?.email
    ) {
      return NextResponse.json(
        {
          error:
            "Your login session is invalid. Please sign in again.",
        },
        {
          status: 401,
        }
      );
    }

    /* =====================================================
       FIND GIFT
    ===================================================== */

    const {
      data: gift,
      error: giftError,
    } = await supabaseAdmin
      .from("gift_memberships")
      .select(
        `
          id,
          parent_email,
          parent_user_id,
          child_id,
          status,
          activated_at
        `
      )
      .eq(
        "activation_token",
        token
      )
      .maybeSingle();

    if (giftError) {
      throw new Error(
        giftError.message
      );
    }

    if (!gift) {
      return NextResponse.json(
        {
          error:
            "This gift invitation could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      gift.status ===
      "cancelled"
    ) {
      return NextResponse.json(
        {
          error:
            "This gift membership is no longer active.",
        },
        {
          status: 410,
        }
      );
    }

    /* =====================================================
       VERIFY EMAIL MATCH
    ===================================================== */

    const signedInEmail =
      user.email
        .trim()
        .toLowerCase();

    const invitedEmail =
      gift.parent_email
        ?.trim()
        .toLowerCase();

    if (
      !invitedEmail ||
      signedInEmail !==
        invitedEmail
    ) {
      return NextResponse.json(
        {
          error:
            `Please sign in using the invited guardian email: ${gift.parent_email}`,
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       PREVENT ANOTHER ACCOUNT FROM CLAIMING
    ===================================================== */

    if (
      gift.parent_user_id &&
      gift.parent_user_id !==
        user.id
    ) {
      return NextResponse.json(
        {
          error:
            "This gift has already been claimed by another account.",
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       ATTACH GIFT TO EXISTING GUARDIAN
    ===================================================== */

    const now =
      new Date()
        .toISOString();

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("gift_memberships")
      .update({
        parent_user_id:
          user.id,

        status:
          "active",

        activated_at:
          gift.activated_at ||
          now,
      })
      .eq(
        "id",
        gift.id
      );

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    return NextResponse.json({
      success: true,
      giftId:
        gift.id,
      childId:
        gift.child_id || null,
    });
  } catch (error) {
    console.error(
      "Claim existing gift error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Could not claim this gift.";

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
