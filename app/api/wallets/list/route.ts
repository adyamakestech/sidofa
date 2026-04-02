import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/get-auth-user";

export async function POST() {
  try {
    const userId = await getAuthUserId();

    const wallets = await db.query(
      "SELECT id, name, balance FROM wallets WHERE user_id=$1 ORDER BY created_at ASC",
      [userId],
    );

    return NextResponse.json(wallets.rows);
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Access token expired" },
        { status: 401 },
      );
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
