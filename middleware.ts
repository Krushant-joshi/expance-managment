import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/* ==========================
   AUTH MIDDLEWARE
========================== */
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const url = req.nextUrl.clone();

  const secret = process.env.JWT_SECRET;

  if (url.pathname.startsWith("/admin")) {
    if (!token || !secret) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const encodedSecret = new TextEncoder().encode(secret);

      await jwtVerify(token, encodedSecret, {
        algorithms: ["HS256"],
      });

      return NextResponse.next();
    } catch (err) {
      console.log("JWT Error:", err);

      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

/* ==========================
   MATCH ROUTES
========================== */
export const config = {
  matcher: ["/admin/:path*"],
};
