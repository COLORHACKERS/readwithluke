"use server";

import { cookies } from "next/headers";

type UnlockResult = {
  success: boolean;
  error?: string;
};

export async function unlockPartnerPass(
  password: string
): Promise<UnlockResult> {
  const expectedPassword = process.env.PARTNER_PASS_PASSWORD;

  if (!expectedPassword) {
    return {
      success: false,
      error: "Partner password has not been configured.",
    };
  }

  if (password.trim() !== expectedPassword) {
    return {
      success: false,
      error: "That password is not correct.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("rwl-partner-pass", "allowed", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/partner-pass",
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
  };
}
