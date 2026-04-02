import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { loginLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const h = await headers();

    const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "127.0.0.1";

    const { success } = await loginLimiter.limit(`login:${ip}:${email}`);

    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Try later." },
        { status: 429 },
      );
    }

    const result = await db.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 403 },
      );
    }

    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 401 });
    }

    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ id: user.id });

    await db.query(
      `
      UPDATE users 
      SET 
        refresh_token=$1,
        last_login=NOW(),
        login_count=login_count + 1,
        last_ip=$3,
        updated_at=NOW()
      WHERE id=$2
      `,
      [refreshToken, user.id, ip],
    );

    const res = NextResponse.json({ success: true });

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      // sameSite: isProd ? "strict" : "lax",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });

    res.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
