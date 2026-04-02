import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/get-auth-user";

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await req.json();

    const { wallet_id, status } = body;

    let query = `
      SELECT id, wallet_id, type, amount, created_at
      FROM transactions
      WHERE user_id = $1
    `;

    const values: any[] = [userId];
    let paramIndex = 2;

    // filter status
    if (status && ["income", "expense"].includes(status)) {
      query += ` AND type = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    // filter wallet
    if (wallet_id) {
      query += ` AND wallet_id = $${paramIndex}`;
      values.push(wallet_id);
      paramIndex++;
    }

    query += " ORDER BY created_at DESC";

    const result = await db.query(query, values);

    return NextResponse.json(result.rows);
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
