import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("/login?error=invalid");
  }

  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const result = await db.query(
    `
    UPDATE users
    SET status='active',
        verify_token=NULL,
        verify_expires=NULL
    WHERE verify_token=$1
      AND verify_expires > now()
    `,
    [hash],
  );

  if (!result.rowCount) {
    return NextResponse.redirect("/login?error=expired");
  }

  return NextResponse.redirect("/login?verified=1");
}
