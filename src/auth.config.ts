import type { NextAuthConfig } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// Edge-safe auth config (NO database access). Shared by middleware and the
// full server config. The `authorized` callback drives route protection.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: { signIn: "/login" },
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID as string,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET as string,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER as string,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isPublic =
        pathname.startsWith("/login") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/health");
      if (isPublic) return true;
      return isLoggedIn; // returning false redirects to the signIn page
    },
  },
};
