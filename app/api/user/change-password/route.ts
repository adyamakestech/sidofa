import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Password tidak valid" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter" },
        { status: 400 },
      );
    }

    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = verifyAccessToken(token);

    const result = await db.query(`SELECT password FROM users WHERE id=$1`, [
      payload.id,
    ]);

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const match = await verifyPassword(oldPassword, user.password);

    if (!match) {
      return NextResponse.json(
        { error: "Password lama salah" },
        { status: 400 },
      );
    }

    const hashed = await hashPassword(newPassword);

    await db.query(
      `
      UPDATE users
      SET password=$1,
          password_updated_at=NOW(),
          updated_at=NOW()
      WHERE id=$2
      `,
      [hashed, payload.id],
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Change password failed" },
      { status: 500 },
    );
  }
}
