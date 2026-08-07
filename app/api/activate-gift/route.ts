import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* =========================================================
   GET — LOOK UP GIFT INVITATION
========================================================= */

export async function GET(req: Request) {
  try {
    const { searchParams } =
      new URL(req.url);

    const token =
      searchParams.get("token")?.trim();

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

    const {
      data: gift,
      error: giftError,
    } = await supabaseAdmin
      .from("gift_memberships")
      .select(
        `
          id,
          purchaser_name,
          parent_email,
          relationship,
          progress_report_requested,
          parent_user_id,
          activated_at,
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

    return NextResponse.json({
      success: true,

      guardianEmail:
        gift.parent_email,

      gifterName:
        gift.purchaser_name ||
        "Someone special",

      relationship:
        gift.relationship,

      progressReportRequested:
        Boolean(
          gift.progress_report_requested
        ),

      alreadyActivated:
        Boolean(
          gift.parent_user_id &&
          gift.activated_at
        ),
    });
  } catch (error) {
    console.error(
      "Gift lookup error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Could not load this gift.";

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

/* =========================================================
   POST — CREATE GUARDIAN ACCOUNT + ACTIVATE GIFT
========================================================= */

export async function POST(req: Request) {
  try {
    const body =
      await req.json();

    const token =
      String(
        body.token || ""
      ).trim();

    const password =
      String(
        body.password || ""
      );

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

    if (
      password.length < 6
    ) {
      return NextResponse.json(
        {
          error:
            "Your password must contain at least 6 characters.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       FIND THE GIFT
    ===================================================== */

    const {
      data: gift,
      error: giftError,
    } = await supabaseAdmin
      .from("gift_memberships")
      .select(
        `
          id,
          purchaser_name,
          purchaser_email,
          parent_email,
          parent_user_id,
          relationship,
          progress_report_requested,
          progress_report_approved,
          status,
          stripe_customer_id,
          stripe_subscription_id,
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

    const guardianEmail =
      gift.parent_email
        ?.trim()
        .toLowerCase();

    if (!guardianEmail) {
      return NextResponse.json(
        {
          error:
            "This gift invitation is missing the guardian email.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       ALREADY ACTIVATED
    ===================================================== */

    if (
      gift.parent_user_id &&
      gift.activated_at
    ) {
      return NextResponse.json(
        {
          error:
            "This gift has already been activated. Please sign in with the guardian account.",

          alreadyActivated:
            true,

          email:
            guardianEmail,
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       CHECK WHETHER GUARDIAN ALREADY HAS AN ACCOUNT
    ===================================================== */

    const {
      data: usersData,
      error: usersError,
    } =
      await supabaseAdmin
        .auth
        .admin
        .listUsers({
          page: 1,
          perPage: 1000,
        });

    if (usersError) {
      throw new Error(
        usersError.message
      );
    }

    const existingUser =
      usersData.users.find(
        (user) =>
          user.email
            ?.trim()
            .toLowerCase() ===
          guardianEmail
      );

    /*
     * Do not overwrite an existing
     * user's password.
     */
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,

          accountExists: true,

          email:
            guardianEmail,

          message:
            "An account already exists for this email. Please sign in to activate your gift.",
        },
        {
          status: 409,
        }
      );
    }

    /* =====================================================
       CREATE GUARDIAN SUPABASE ACCOUNT
    ===================================================== */

    const {
      data:
        createdUserData,
      error:
        createUserError,
    } =
      await supabaseAdmin
        .auth
        .admin
        .createUser({
          email:
            guardianEmail,

          password,

          email_confirm:
            true,
        });

    if (
      createUserError ||
      !createdUserData.user
    ) {
      throw new Error(
        createUserError?.message ||
          "Could not create the guardian account."
      );
    }

    const guardianUser =
      createdUserData.user;

    /* =====================================================
       ACTIVATE THE GIFT
    ===================================================== */

    const now =
      new Date()
        .toISOString();

    const {
      error:
        activationError,
    } =
      await supabaseAdmin
        .from(
          "gift_memberships"
        )
        .update({
          parent_user_id:
            guardianUser.id,

          status:
            "active",

          activated_at:
            now,

          /*
           * Never approve sharing
           * automatically.
           */
          progress_report_approved:
            false,
        })
        .eq(
          "id",
          gift.id
        );

    if (
      activationError
    ) {
      throw new Error(
        activationError.message
      );
    }

    /* =====================================================
       CREATE / UPDATE GUARDIAN PROFILE
    ===================================================== */

    const {
      error:
        profileError,
    } =
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id:
              guardianUser.id,

            email:
              guardianEmail,

            membership_status:
              "active",

            stripe_customer_id:
              gift.stripe_customer_id,

            stripe_subscription_id:
              gift.stripe_subscription_id,
          },
          {
            onConflict:
              "id",
          }
        );

    if (profileError) {
      throw new Error(
        profileError.message
      );
    }

    /* =====================================================
       SEND RESULTS BACK TO ACTIVATION PAGE
    ===================================================== */

    return NextResponse.json({
      success: true,

      message:
        "Your Read With Luke gift is active!",

      email:
        guardianEmail,

      giftId:
        gift.id,

      gifterName:
        gift.purchaser_name ||
        "Your gift giver",

      progressReportRequested:
        Boolean(
          gift.progress_report_requested
        ),
    });
  } catch (error) {
    console.error(
      "Activate gift error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Could not activate gift.";

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
