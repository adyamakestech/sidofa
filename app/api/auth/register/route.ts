import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { generateToken } from "@/lib/token";
import { sendEmail } from "@/lib/email";
import { verifyEmailTemplate } from "@/lib/email-template";
import { registerLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const ip = (await headers()).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await registerLimiter.limit(`register:${ip}:${email}`);

    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const existing = await db.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);

    if (existing.rowCount) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(password);
    const { raw, hash } = generateToken();

    await db.query(
      `
      INSERT INTO users
      (name,email,password,verify_token,verify_expires)
      VALUES ($1,$2,$3,$4,now()+interval '1 day')
      `,
      [name, email, hashedPassword, hash],
    );

    const link = `${process.env.APP_URL}/api/auth/verify?token=${raw}`;

    await sendEmail({
      to: email,
      subject: "Verify Your Account",
      html: verifyEmailTemplate(name, link),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Register failed" }, { status: 500 });
  }
}
