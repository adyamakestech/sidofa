import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth";

export async function getAuthUserId() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload: any = verifyAccessToken(token);
  return payload.id;
}
