import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "drp-platform-hackathon-secure-jwt-secret-key-32chars"
);

const SESSION_COOKIE_NAME = "drp_session";

// Routes that require an active session
const PROTECTED_PREFIXES = ["/dashboard", "/analyses", "/incidents", "/brands", "/reports", "/settings"];

// Public auth routes (logged-in users will be redirected to /dashboard)
const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isValidSession = false;
  let sessionPayload: any = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      isValidSession = true;
      sessionPayload = payload;
    } catch {
      isValidSession = false;
    }
  }

  // 1. Redirect unauthenticated users trying to access protected paths
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected && !isValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from /login and /register to /dashboard
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Add user context headers for downstream handlers
  const response = NextResponse.next();
  if (isValidSession && sessionPayload) {
    response.headers.set("x-user-id", sessionPayload.id as string);
    response.headers.set("x-user-role", sessionPayload.role as string);
    response.headers.set("x-user-org", sessionPayload.organizationId as string);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analyses/:path*",
    "/incidents/:path*",
    "/brands/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
