import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Verify ACCESS token (bukan refresh)
    const payload: any = verifyAccessToken(token);

    const result = await db.query(
      `
      SELECT 
        id,
        name,
        email,
        phone,
        role,
        avatar,
        last_login,
        created_at
      FROM users
      WHERE id=$1
      `,
      [payload.id],
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      lastLogin: user.last_login,
      createdAt: user.created_at,
    });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Access token expired" },
        { status: 401 },
      );
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
