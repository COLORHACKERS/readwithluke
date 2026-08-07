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
            "Please sign in before saving your report card preference.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const token = String(
      body.token || ""
    ).trim();

    const approved =
      body.approved === true;

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
       VERIFY SIGNED-IN GUARDIAN
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
          progress_report_requested,
          progress_report_approved,
          status
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
       VERIFY GUARDIAN OWNS THIS GIFT
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
            "This gift belongs to a different guardian account.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      !gift.parent_user_id ||
      gift.parent_user_id !==
        user.id
    ) {
      return NextResponse.json(
        {
          error:
            "This gift has not been activated by this account.",
        },
        {
          status: 403,
        }
      );
    }

    /* =====================================================
       ONLY ALLOW CONSENT IF REQUESTED
    ===================================================== */

    if (
      !gift.progress_report_requested
    ) {
      return NextResponse.json(
        {
          error:
            "A monthly report card was not requested for this gift.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       SAVE GUARDIAN DECISION
    ===================================================== */

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("gift_memberships")
      .update({
        progress_report_approved:
          approved,
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
      approved,
      message: approved
        ? "Monthly report cards are approved."
        : "Monthly report cards will not be shared.",
    });
  } catch (error) {
    console.error(
      "Gift report consent error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Could not save your report card preference.";

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
