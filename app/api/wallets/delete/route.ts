import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/get-auth-user";

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await req.json();

    const { id } = body;

    const result = await db.query(
      "DELETE FROM wallets WHERE id=$1 AND user_id=$2",
      [id, userId],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Dompet tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Dompet berhasil dihapus",
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus dompet" },
      { status: 500 },
    );
  }
}
