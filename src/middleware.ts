import { NextRequest, NextResponse } from "next/server";

const learnerAllowed = ["/curriculum", "/api/health", "/api/auth", "/login"];
const staticPrefixes = ["/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (staticPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const persona = request.cookies.get("fde_persona")?.value === "ADMIN" ? "ADMIN" : "USER";
  if (persona === "ADMIN") return NextResponse.next();

  const isAllowed = learnerAllowed.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (isAllowed) return NextResponse.next();

  return NextResponse.redirect(new URL("/curriculum", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|svg|ico|jpg|jpeg|webp)$).*)"],
};
