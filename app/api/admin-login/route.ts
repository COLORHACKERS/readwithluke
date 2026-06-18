import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  return NextResponse.json({
    success: password === process.env.ADMIN_PASSWORD,
  });
}