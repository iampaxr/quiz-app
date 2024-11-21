import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/",
  "/topics",
  "/topics/*",
  "/viewtopic",
  "/viewtopic/*",
];
const loginRoute = "/login";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req: req as any,
    secret: "m8bVR7LDvLw+dXJ5wzD9zPDnFLIopKVNvUXg/pGBcO0=",
  });

  const { pathname } = req.nextUrl;
  console.log(pathname);
  if (token && pathname === loginRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(loginRoute, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Also exclude the login route from middleware to prevent redirect loops
     */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
