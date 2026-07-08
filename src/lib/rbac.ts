import { auth } from "@/auth";

export async function currentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function isAdmin() {
  const u = await currentUser();
  return u?.role === "ADMIN";
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Forbidden: admin role required.");
  }
}
