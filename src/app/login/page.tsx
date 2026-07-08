import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-6 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-azure-bright/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-azure-bright to-gold text-lg font-black text-navy-900">
            F
          </span>
          <div>
            <div className="text-lg font-bold leading-tight">FDE Academy Tracker</div>
            <div className="text-xs uppercase tracking-widest text-slate-300">
              Wipro × Microsoft
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mt-1.5 text-sm text-slate-300">
            Track &amp; monitor the 16-week Forward Deployed Engineer program. Use your
            Microsoft work account.
          </p>

          <form
            className="mt-6"
            action={async () => {
              "use server";
              await signIn("microsoft-entra-id", { redirectTo: "/" });
            }}
          >
            <button className="btn w-full bg-white py-2.5 text-navy-800 hover:bg-slate-100">
              <MicrosoftMark />
              Sign in with Microsoft
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Secured by Microsoft Entra ID single sign-on
          </p>
        </div>
      </div>
    </div>
  );
}

function MicrosoftMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}
