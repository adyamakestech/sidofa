import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const { name, phone } = await req.json();

    const token = (await cookies()).get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = verifyAccessToken(token);

    await db.query(
      `
      UPDATE users
      SET 
        name=$1,
        phone=$2,
        updated_at=NOW()
      WHERE id=$3
      `,
      [name, phone, payload.id],
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Update profile failed" },
      { status: 500 },
    );
  }
}
