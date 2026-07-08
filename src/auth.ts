import type { Session } from "next-auth";
import { cookies } from "next/headers";

export type Persona = "ADMIN" | "USER";

export const PERSONA_COOKIE = "fde_persona";

export function getPersona(): Persona {
  return cookies().get(PERSONA_COOKIE)?.value === "ADMIN" ? "ADMIN" : "USER";
}

export async function auth() {
  const persona = getPersona();
  return {
    user: {
      name: persona === "ADMIN" ? "Demo Admin" : "Demo Learner",
      email: persona === "ADMIN" ? "admin@fde.local" : "learner@fde.local",
      image: null,
      role: persona === "ADMIN" ? "ADMIN" : "VIEWER",
    },
    expires: "2099-12-31T23:59:59.999Z",
  } satisfies Session;
}

export async function signIn() {
  return undefined;
}

export async function signOut() {
  return undefined;
}
