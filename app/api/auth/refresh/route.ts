import { NextResponse } from "next/server";
import { verifyToken, signAccessToken } from "@/lib/auth";

export async function POST(req: Request) {
  const refreshToken = req.headers
    .get("cookie")
    ?.match(/refresh_token=([^;]+)/)?.[1];

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const payload: any = verifyToken(refreshToken);

    const newAccess = signAccessToken({
      id: payload.id,
      role: payload.role,
    });

    const res = NextResponse.json({ success: true });

    res.cookies.set("access_token", newAccess, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  }
}
