import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/get-auth-user";

export async function POST(req: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await req.json();

    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Nama dompet wajib diisi" },
        { status: 400 },
      );
    }

    const wallet = await db.query(
      `
      INSERT INTO wallets (user_id, name )
      VALUES ($1,$2)
      RETURNING id,name
      `,
      [userId, name.trim()],
    );

    return NextResponse.json(wallet.rows[0]);
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat dompet" },
      { status: 500 },
    );
  }
}
