import { auth, signOut } from "@/auth";
import { getActivePlan } from "../lib/plans";
import { PlanBadge } from "./PlanBadge";
import { LogOut } from "lucide-react";

function initials(name?: string | null) {
  if (!name) return "•";
  return name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export async function TopBar() {
  const [session, plan] = await Promise.all([auth(), getActivePlan()]);
  const user = session?.user;

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-white/85 px-5 py-2.5 backdrop-blur lg:px-8">
      <div className="text-sm font-semibold text-slate-500">
        Wipro × Microsoft FDE Academy
      </div>
      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        {plan && <PlanBadge planKey={plan.key} name={plan.name} />}
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-navy-700 text-[11px] font-bold text-white">
            {initials(user?.name)}
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-semibold">{user?.name ?? "Signed in"}</div>
            <div className="text-[11px] capitalize text-slate-500">
              {(user?.role ?? "viewer").toLowerCase()}
            </div>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="btn btn-ghost px-2.5 py-1.5 text-xs" title="Sign out">
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
