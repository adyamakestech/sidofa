import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/token";
import { sendEmail } from "@/lib/email";
import { resetPasswordTemplate } from "@/lib/email-template";
import { forgotLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
  }

  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "127.0.0.1";

  const { success } = await forgotLimiter.limit(`forgot:${ip}:${email}`);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const user = await db.query("SELECT id,name FROM users WHERE email=$1", [
    email,
  ]);

  if (!user.rowCount) {
    return NextResponse.json({ success: true });
  }

  const { raw, hash } = generateToken();

  await db.query(
    `
    UPDATE users
    SET reset_token=$1,
        reset_expires=now()+interval '1 hour'
    WHERE email=$2
    `,
    [hash, email],
  );

  const link = `${process.env.APP_URL}/reset?token=${raw}`;

  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: resetPasswordTemplate(user.rows[0].name, link),
  });

  const res = NextResponse.json({ success: true });

  res.cookies.set("forgot_flow", "1", {
    maxAge: 60,
    httpOnly: true,
    path: "/",
  });

  return res;
}
