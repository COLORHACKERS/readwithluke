import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, readerName } = await req.json();

    const { error } = await resend.emails.send({
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
              href="https://readwithluke.com/library"
              style="
                background:#FF5526;
                color:white;
                text-decoration:none;
                padding:16px 28px;
                border-radius:999px;
                font-weight:bold;
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

    if (error) {
      return NextResponse.json(error, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
