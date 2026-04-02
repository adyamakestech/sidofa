import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/get-auth-user";

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await req.json();

    const { id } = body;

    const result = await db.query(
      "SELECT id, name FROM wallets WHERE id=$1 AND user_id=$2 LIMIT 1",
      [id, userId],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Dompet tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil dompet" },
      { status: 500 },
    );
  }
}
