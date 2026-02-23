import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/token";
import { sendEmail } from "@/lib/email";
import { resetPasswordTemplate } from "@/lib/email-template";
import { forgotLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const { email } = await req.json();
  const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";

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

  return NextResponse.json({ success: true });
}
