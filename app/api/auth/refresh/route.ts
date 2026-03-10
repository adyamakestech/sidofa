import { NextResponse } from "next/server";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST() {
  const refreshToken = (await cookies()).get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const payload: any = verifyRefreshToken(refreshToken);

    const result = await db.query(
      "SELECT id, role, refresh_token FROM users WHERE id=$1",
      [payload.id],
    );

    const user = result.rows[0];

    if (!user || user.refresh_token !== refreshToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 🔥 ROTATE TOKEN
    const newRefreshToken = signRefreshToken({ id: user.id });
    const newAccessToken = signAccessToken({
      id: user.id,
      role: user.role,
    });

    await db.query(
      "UPDATE users SET refresh_token=$1, updated_at=NOW() WHERE id=$2",
      [newRefreshToken, user.id],
    );

    const res = NextResponse.json({ success: true });

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: isProd ? "strict" : "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    res.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  }
}
