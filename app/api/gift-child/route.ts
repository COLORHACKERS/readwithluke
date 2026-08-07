import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* =========================================================
   VERIFY LOGGED-IN GUARDIAN
========================================================= */

async function getGuardian(req: Request) {
  const authorization =
    req.headers.get("authorization");

  const accessToken =
    authorization
      ?.replace("Bearer ", "")
      .trim();

  if (!accessToken) {
    throw new Error(
      "Please sign in before choosing a reader."
    );
  }

  const {
    data: { user },
    error,
  } =
    await supabaseAdmin.auth.getUser(
      accessToken
    );

  if (error || !user?.email) {
    throw new Error(
      "Your login session is invalid."
    );
  }

  return user;
}

/* =========================================================
   GET — LOAD GUARDIAN'S CHILDREN
========================================================= */

export async function GET(req: Request) {
  try {
    const user =
      await getGuardian(req);

    const { searchParams } =
      new URL(req.url);

    const token =
      searchParams
        .get("token")
        ?.trim();

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Missing gift token.",
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
          parent_email,
          parent_user_id,
          child_id,
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
            "Gift could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      gift.parent_user_id !==
      user.id
    ) {
      return NextResponse.json(
        {
          error:
            "This gift does not belong to this guardian account.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      data: children,
      error: childrenError,
    } = await supabaseAdmin
      .from("children")
      .select(
        `
          id,
          name,
          age_range,
          avatar,
          favorite_theme
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

    if (childrenError) {
      throw new Error(
        childrenError.message
      );
    }

    return NextResponse.json({
      success: true,
      children:
        children || [],
      selectedChildId:
        gift.child_id || null,
    });
  } catch (error) {
    console.error(
      "Gift child lookup error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not load readers.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST — ASSIGN OR CREATE CHILD
========================================================= */

export async function POST(req: Request) {
  try {
    const user =
      await getGuardian(req);

    const body =
      await req.json();

    const token =
      String(
        body.token || ""
      ).trim();

    const existingChildId =
      String(
        body.childId || ""
      ).trim();

    const newChildName =
      String(
        body.name || ""
      ).trim();

    const ageRange =
      String(
        body.ageRange || "5-6"
      ).trim();

    const avatar =
      String(
        body.avatar || "🐸"
      ).trim();

    const favoriteTheme =
      String(
        body.favoriteTheme ||
          "Adventure"
      ).trim();

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Missing gift token.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       VERIFY GIFT
    ===================================================== */

    const {
      data: gift,
      error: giftError,
    } = await supabaseAdmin
      .from("gift_memberships")
      .select(
        `
          id,
          parent_user_id,
          parent_email,
          child_id,
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
            "Gift could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      gift.parent_user_id !==
      user.id
    ) {
      return NextResponse.json(
        {
          error:
            "This gift does not belong to this guardian account.",
        },
        {
          status: 403,
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
            "This gift is no longer active.",
        },
        {
          status: 410,
        }
      );
    }

    let childId =
      existingChildId;

    /* =====================================================
       USE EXISTING CHILD
    ===================================================== */

    if (childId) {
      const {
        data: existingChild,
        error: childError,
      } = await supabaseAdmin
        .from("children")
        .select("id")
        .eq(
          "id",
          childId
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

      if (childError) {
        throw new Error(
          childError.message
        );
      }

      if (!existingChild) {
        return NextResponse.json(
          {
            error:
              "That reader does not belong to this guardian account.",
          },
          {
            status: 403,
          }
        );
      }
    }

    /* =====================================================
       CREATE NEW CHILD
    ===================================================== */

    if (!childId) {
      if (!newChildName) {
        return NextResponse.json(
          {
            error:
              "Please enter the child's name.",
          },
          {
            status: 400,
          }
        );
      }

      const {
        data: createdChild,
        error:
          createChildError,
      } = await supabaseAdmin
        .from("children")
        .insert({
          user_id:
            user.id,

          name:
            newChildName,

          age_range:
            ageRange,

          avatar,

          favorite_theme:
            favoriteTheme,
        })
        .select("id")
        .single();

      if (
        createChildError ||
        !createdChild
      ) {
        throw new Error(
          createChildError?.message ||
            "Could not create the reader."
        );
      }

      childId =
        createdChild.id;
    }

    /* =====================================================
       ATTACH CHILD TO GIFT
    ===================================================== */

    const {
      error: giftUpdateError,
    } = await supabaseAdmin
      .from("gift_memberships")
      .update({
        child_id:
          childId,
      })
      .eq(
        "id",
        gift.id
      );

    if (giftUpdateError) {
      throw new Error(
        giftUpdateError.message
      );
    }

    /* =====================================================
       MAKE CHILD CURRENT READER
    ===================================================== */

    const {
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .update({
        active_child_id:
          childId,
      })
      .eq(
        "id",
        user.id
      );

    if (profileError) {
      throw new Error(
        profileError.message
      );
    }

    return NextResponse.json({
      success: true,
      childId,
    });
  } catch (error) {
    console.error(
      "Gift child error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not choose the reader.",
      },
      {
        status: 500,
      }
    );
  }
}
