import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/get-auth-user";

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await req.json();

    const { id, name } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Nama dompet wajib diisi" },
        { status: 400 },
      );
    }

    const result = await db.query(
      `
      UPDATE wallets
      SET name=$1
      WHERE id=$2 AND user_id=$3
      RETURNING id, name
      `,
      [name.trim(), id, userId],
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
      { error: "Gagal memperbarui dompet" },
      { status: 500 },
    );
  }
}
