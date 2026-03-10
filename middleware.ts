import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // ===== PUBLIC ROUTES =====
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // ===== RESET TOKEN CHECK =====
  if (pathname === "/reset") {
    if (!searchParams.get("token")) {
      return NextResponse.redirect(new URL("/forgot", req.url));
    }
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  console.log("PATH:", pathname);
  console.log("TOKEN:", token);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
