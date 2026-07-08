import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge middleware — uses the DB-free config so it stays edge-compatible.
export default NextAuth(authConfig).auth;

export const config = {
  // Run on everything except static assets & image optimizer.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|ico)$).*)"],
};
