import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;

    if (!segmentId) {
      console.error("Missing RESEND_NEWSLETTER_SEGMENT_ID");

      return NextResponse.json(
        { error: "Newsletter is not configured." },
        { status: 500 }
      );
    }

    // Check whether this email already exists in Resend.
    const { data: existingContact } = await resend.contacts.get({
      email: cleanEmail,
    });

    if (existingContact) {
      // Existing contact: simply add them to the newsletter segment.
      const { error: segmentError } =
        await resend.contacts.segments.add({
          email: cleanEmail,
          segmentId,
        });

      if (segmentError) {
        console.error("Resend segment error:", segmentError);

        return NextResponse.json(
          { error: "Unable to subscribe right now." },
          { status: 500 }
        );
      }
    } else {
      // New contact: create them and add them directly to the segment.
      const { error: contactError } = await resend.contacts.create({
        email: cleanEmail,
        unsubscribed: false,
        segments: [
          {
            id: segmentId,
          },
        ],
      });

      if (contactError) {
        console.error("Resend contact error:", contactError);

        return NextResponse.json(
          { error: "Unable to subscribe right now." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "You're subscribed!",
    });
  } catch (error) {
    console.error("Newsletter error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
