import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams, origin } = req.nextUrl;

  // ===== RESET TOKEN CHECK =====
  if (pathname === "/auth/reset") {
    if (!searchParams.get("token")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  // ===== PUBLIC ROUTES =====
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/")
  ) {
    if (pathname === "/auth/forgot/success") {
      const flow = req.cookies.get("forgot_flow");

      if (!flow) {
        return NextResponse.redirect(new URL("/auth/forgot", req.url));
      }
    }

    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await fetch(`${origin}/api/auth/refresh`, {
        method: "POST",
        headers: {
          cookie: `refresh_token=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        const res = NextResponse.next();

        const cookies = refreshRes.headers.getSetCookie();

        for (const cookie of cookies) {
          res.headers.append("set-cookie", cookie);
        }

        return res;
      }
    } catch (err) {
      console.error("Refresh error:", err);
    }
  }

  return NextResponse.redirect(new URL("/auth/login", req.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/reset", "/auth/forgot/success"],
};
