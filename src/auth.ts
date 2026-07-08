import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { prisma } from "./lib/db";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .toLowerCase()
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Full server-side config (Node runtime) — adds DB-backed callbacks.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (!user?.email) return false;
      const email = user.email.toLowerCase();
      const makeAdmin = adminEmails.includes(email);
      await prisma.user.upsert({
        where: { email },
        update: {
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          lastLoginAt: new Date(),
          ...(makeAdmin ? { role: "ADMIN" } : {}),
        },
        create: {
          email,
          name: user.name ?? null,
          image: user.image ?? null,
          role: makeAdmin ? "ADMIN" : "VIEWER",
        },
      });
      return true;
    },
    async jwt({ token }) {
      // Resolve role once and cache it on the token.
      if (!token.role && token.email) {
        const u = await prisma.user.findUnique({
          where: { email: (token.email as string).toLowerCase() },
        });
        token.role = u?.role ?? "VIEWER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = (token.role as string) ?? "VIEWER";
      return session;
    },
  },
});
