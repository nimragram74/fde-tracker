import type { Session } from "next-auth";

const demoSession = {
  user: {
    name: "Demo Admin",
    email: "demo@fde.local",
    image: null,
    role: "ADMIN",
  },
  expires: "2099-12-31T23:59:59.999Z",
} satisfies Session;

export async function auth() {
  return demoSession;
}

export async function signIn() {
  return undefined;
}

export async function signOut() {
  return undefined;
}
