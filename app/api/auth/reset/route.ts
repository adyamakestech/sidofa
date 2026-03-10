import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import crypto from "crypto";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const result = await db.query(
    `
    UPDATE users
    SET password=$1,
        reset_token=NULL,
        reset_expires=NULL,
        refresh_token=NULL,
        updated_at=NOW()
    WHERE reset_token=$2
      AND reset_expires > now()
    `,
    [hashedPassword, hash],
  );

  if (!result.rowCount) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true });
}
