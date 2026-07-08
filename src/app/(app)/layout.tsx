import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { isAdmin } from "../../lib/rbac";
import { getOrgName } from "../../lib/settings";

export const dynamic = "force-dynamic";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const [admin, orgName] = await Promise.all([isAdmin(), getOrgName()]);
  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={admin} orgName={orgName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
