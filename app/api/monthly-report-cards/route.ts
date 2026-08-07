import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(
  process.env.RESEND_API_KEY
);

type ReadingHistoryRow = {
  book_id: string;
  completed_at: string;
  coins_earned: number | null;
  books:
    | {
        title: string;
      }
    | {
        title: string;
      }[]
    | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getPreviousMonthRange() {
  const now = new Date();

  const startOfThisMonth = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1
    )
  );

  const startOfPreviousMonth =
    new Date(
      Date.UTC(
        startOfThisMonth.getUTCFullYear(),
        startOfThisMonth.getUTCMonth() - 1,
        1
      )
    );

  return {
    start:
      startOfPreviousMonth.toISOString(),

    end:
      startOfThisMonth.toISOString(),

    monthName:
      startOfPreviousMonth.toLocaleString(
        "en-US",
        {
          month: "long",
          timeZone: "UTC",
        }
      ),

    year:
      startOfPreviousMonth.getUTCFullYear(),
  };
}

function getBookTitle(
  books: ReadingHistoryRow["books"]
) {
  if (!books) {
    return "Read With Luke Story";
  }

  if (Array.isArray(books)) {
    return (
      books[0]?.title ||
      "Read With Luke Story"
    );
  }

  return (
    books.title ||
    "Read With Luke Story"
  );
}

/* =========================================================
   SEND ONE CHILD'S REPORT CARD
========================================================= */

async function sendReportCard({
  gifterEmail,
  gifterName,
  childName,
  monthName,
  year,
  booksCompleted,
  coinsEarned,
  readingDays,
  bookTitles,
}: {
  gifterEmail: string;
  gifterName: string;
  childName: string;
  monthName: string;
  year: number;
  booksCompleted: number;
  coinsEarned: number;
  readingDays: number;
  bookTitles: string[];
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.readwithluke.com";

  const safeGifterName =
    escapeHtml(gifterName);

  const safeChildName =
    escapeHtml(childName);

  const bookList =
    bookTitles.length > 0
      ? bookTitles
          .map(
            (title) => `
              <li style="
                margin-bottom:8px;
                line-height:1.4;
              ">
                ${escapeHtml(title)}
              </li>
            `
          )
          .join("")
      : `
          <li>
            No completed stories this month.
          </li>
        `;

  await resend.emails.send({
    from:
      "Read With Luke <hello@readwithluke.com>",

    to: gifterEmail,

    subject:
      `📚 ${safeChildName}'s ${monthName} Reading Report`,

    html: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:620px;
        margin:auto;
        padding:40px;
        background:#F8F1E6;
        border-radius:24px;
      ">

        <p style="
          margin:0 0 8px;
          color:#FF5526;
          font-size:13px;
          font-weight:bold;
          letter-spacing:.08em;
        ">
          READ WITH LUKE REPORT CARD
        </p>

        <h1 style="
          margin:0;
          color:#13294B;
          font-size:38px;
          line-height:1.05;
        ">
          ${safeChildName}'s
          ${monthName} Reading Adventure
        </h1>

        <p style="
          margin-top:22px;
          line-height:1.6;
        ">
          Hi ${safeGifterName},
        </p>

        <p style="
          line-height:1.6;
        ">
          Here's a little look at
          ${safeChildName}'s Read With Luke
          adventure during
          <strong>${monthName} ${year}</strong>.
        </p>

        <div style="
          margin:30px 0;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:10px;
        ">

          <div style="
            padding:20px 10px;
            background:#ffffff;
            border-radius:18px;
            text-align:center;
          ">
            <div style="
              font-size:28px;
            ">
              📚
            </div>

            <strong style="
              display:block;
              margin-top:7px;
              color:#FF5526;
              font-size:28px;
            ">
              ${booksCompleted}
            </strong>

            <span style="
              display:block;
              margin-top:5px;
              color:#13294B;
              font-size:11px;
              font-weight:bold;
            ">
              BOOKS COMPLETED
            </span>
          </div>

          <div style="
            padding:20px 10px;
            background:#ffffff;
            border-radius:18px;
            text-align:center;
          ">
            <div style="
              font-size:28px;
            ">
              🪙
            </div>

            <strong style="
              display:block;
              margin-top:7px;
              color:#FF5526;
              font-size:28px;
            ">
              ${coinsEarned}
            </strong>

            <span style="
              display:block;
              margin-top:5px;
              color:#13294B;
              font-size:11px;
              font-weight:bold;
            ">
              COINS EARNED
            </span>
          </div>

          <div style="
            padding:20px 10px;
            background:#ffffff;
            border-radius:18px;
            text-align:center;
          ">
            <div style="
              font-size:28px;
            ">
              ⭐
            </div>

            <strong style="
              display:block;
              margin-top:7px;
              color:#FF5526;
              font-size:28px;
            ">
              ${readingDays}
            </strong>

            <span style="
              display:block;
              margin-top:5px;
              color:#13294B;
              font-size:11px;
              font-weight:bold;
            ">
              READING DAYS
            </span>
          </div>
        </div>

        <div style="
          padding:24px;
          background:#ffffff;
          border-radius:20px;
        ">
          <h2 style="
            margin:0 0 15px;
            color:#13294B;
            font-size:20px;
          ">
            📖 Stories Completed
          </h2>

          <ul style="
            margin:0;
            padding-left:20px;
            color:#333333;
          ">
            ${bookList}
          </ul>
        </div>

        <div style="
          margin-top:26px;
          padding:20px;
          background:#FFF3D6;
          border-radius:18px;
          text-align:center;
        ">
          <strong style="
            color:#13294B;
            font-size:17px;
          ">
            Keep cheering them on! 🎉
          </strong>

          <p style="
            margin:8px 0 0;
            line-height:1.5;
            font-size:14px;
          ">
            Every story is another little
            adventure completed.
          </p>
        </div>

        <p style="
          margin-top:30px;
          text-align:center;
        ">
          <a
            href="${siteUrl}"
            style="
              display:inline-block;
              padding:15px 26px;
              border-radius:999px;
              background:#FF5526;
              color:#ffffff;
              font-weight:bold;
              text-decoration:none;
            "
          >
            Visit Read With Luke →
          </a>
        </p>

        <hr style="
          margin:38px 0 24px;
          border:none;
          border-top:1px solid #ddd3c4;
        ">

        <p style="
          margin:0;
          color:#777;
          font-size:12px;
          line-height:1.5;
        ">
          You are receiving this report because
          the child's parent or guardian approved
          sharing monthly Read With Luke report
          cards with you.
        </p>

        <p style="
          color:#777;
          font-size:12px;
        ">
          <strong>
            The Read With Luke Team
          </strong>
        </p>
      </div>
    `,
  });
}

/* =========================================================
   MONTHLY REPORT JOB
========================================================= */

export async function GET(
  req: Request
) {
  try {
    /*
     * Protect this endpoint so random
     * visitors cannot trigger all report emails.
     */
    const authorization =
      req.headers.get(
        "authorization"
      );

    const cronSecret =
      process.env.CRON_SECRET;

    if (!cronSecret) {
      throw new Error(
        "Missing CRON_SECRET."
      );
    }

    if (
      authorization !==
      `Bearer ${cronSecret}`
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      start,
      end,
      monthName,
      year,
    } =
      getPreviousMonthRange();

    /* =====================================================
       FIND APPROVED GIFT REPORTS
    ===================================================== */

    const {
      data: gifts,
      error: giftsError,
    } = await supabaseAdmin
      .from("gift_memberships")
      .select(
        `
          id,
          purchaser_name,
          purchaser_email,
          child_id,
          progress_report_requested,
          progress_report_approved,
          status
        `
      )
      .eq(
        "progress_report_requested",
        true
      )
      .eq(
        "progress_report_approved",
        true
      )
      .not(
        "child_id",
        "is",
        null
      );

    if (giftsError) {
      throw new Error(
        giftsError.message
      );
    }

    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const gift of gifts || []) {
      try {
        if (
          gift.status ===
          "cancelled"
        ) {
          skipped++;
          continue;
        }

        if (
          !gift.purchaser_email ||
          !gift.child_id
        ) {
          skipped++;
          continue;
        }

        /* =================================================
           CHILD
        ================================================= */

        const {
          data: child,
          error: childError,
        } = await supabaseAdmin
          .from("children")
          .select(
            "id, name"
          )
          .eq(
            "id",
            gift.child_id
          )
          .maybeSingle();

        if (childError) {
          throw new Error(
            childError.message
          );
        }

        if (!child) {
          skipped++;
          continue;
        }

        /* =================================================
           PREVIOUS MONTH READING
        ================================================= */

        const {
          data: history,
          error: historyError,
        } = await supabaseAdmin
          .from("reading_history")
          .select(
            `
              book_id,
              completed_at,
              coins_earned,
              books (
                title
              )
            `
          )
          .eq(
            "child_id",
            child.id
          )
          .gte(
            "completed_at",
            start
          )
          .lt(
            "completed_at",
            end
          )
          .order(
            "completed_at",
            {
              ascending: true,
            }
          );

        if (historyError) {
          throw new Error(
            historyError.message
          );
        }

        const rows =
          (history ||
            []) as ReadingHistoryRow[];

        const booksCompleted =
          rows.length;

        const coinsEarned =
          rows.reduce(
            (sum, item) =>
              sum +
              (item.coins_earned ||
                0),
            0
          );

        const readingDays =
          new Set(
            rows.map((item) =>
              new Date(
                item.completed_at
              )
                .toISOString()
                .slice(0, 10)
            )
          ).size;

        const bookTitles =
          rows.map((item) =>
            getBookTitle(
              item.books
            )
          );

        /*
         * We still send a report with
         * zero activity. That tells the
         * gifter the system is working
         * rather than silently skipping
         * a month.
         */
        await sendReportCard({
          gifterEmail:
            gift.purchaser_email,

          gifterName:
            gift.purchaser_name ||
            "Friend",

          childName:
            child.name ||
            "Your Reader",

          monthName,

          year,

          booksCompleted,

          coinsEarned,

          readingDays,

          bookTitles,
        });

        sent++;
      } catch (error) {
        console.error(
          `Report failed for gift ${gift.id}:`,
          error
        );

        errors.push(
          `Gift ${gift.id}: ${
            error instanceof Error
              ? error.message
              : "Unknown error"
          }`
        );
      }
    }

    return NextResponse.json({
      success: true,
      month:
        `${monthName} ${year}`,
      sent,
      skipped,
      errors,
    });
  } catch (error) {
    console.error(
      "Monthly report card error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not send monthly report cards.",
      },
      {
        status: 500,
      }
    );
  }
}
