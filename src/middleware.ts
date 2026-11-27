import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secure_daily_knead_jwt_secret_key_32chars_min"
);

const COOKIE_NAME = "knead_session_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isDashboardRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = (payload.role as string) || "user";

    // Hanya role 'admin' yang diizinkan mengakses dashboard & admin API
    if (role !== "admin") {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { success: false, error: "Forbidden: Hak akses administrator diperlukan." },
          { status: 403 }
        );
      }
      // Redirect user biasa ke beranda jika mencoba membuka /dashboard
      const homeUrl = new URL("/?unauthorized=true", request.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  } catch {
    if (isAdminApiRoute) {
      return NextResponse.json(
        { success: false, error: "Session invalid atau telah kedaluwarsa." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
