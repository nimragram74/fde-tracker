import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PERSONA_COOKIE, type Persona } from "@/auth";

async function setPersona(formData: FormData) {
  "use server";
  const persona = formData.get("persona") === "ADMIN" ? "ADMIN" : "USER";
  cookies().set(PERSONA_COOKIE, persona, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(persona === "ADMIN" ? "/" : "/curriculum");
}

export function PersonaSwitch({ persona }: { persona: Persona }) {
  return (
    <form action={setPersona} className="flex rounded-md border border-line bg-slate-50 p-0.5">
      <button
        name="persona"
        value="USER"
        className={`rounded px-2.5 py-1 text-xs font-semibold ${
          persona === "USER" ? "bg-white text-azure shadow-sm" : "text-slate-500 hover:text-ink"
        }`}
      >
        Learner
      </button>
      <button
        name="persona"
        value="ADMIN"
        className={`rounded px-2.5 py-1 text-xs font-semibold ${
          persona === "ADMIN" ? "bg-white text-azure shadow-sm" : "text-slate-500 hover:text-ink"
        }`}
      >
        Admin
      </button>
    </form>
  );
}
