"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  Rocket,
  Sliders,
  Settings,
  Boxes,
} from "lucide-react";

const adminNavGroups = [
  { section: "Overview", items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }] },
  {
    section: "Program",
    items: [{ href: "/curriculum", label: "Curriculum", icon: BookOpen }],
  },
  {
    section: "Tracking",
    items: [
      { href: "/cohorts", label: "Cohorts", icon: Boxes },
      { href: "/participants", label: "Participants", icon: Users },
      { href: "/progress", label: "Progress board", icon: LayoutDashboard },
      { href: "/certifications", label: "Certifications", icon: Award },
      { href: "/capstones", label: "Capstones", icon: Rocket },
    ],
  },
];

const learnerNavGroups = [
  {
    section: "Learning",
    items: [{ href: "/curriculum", label: "Curriculum", icon: BookOpen }],
  },
];

const adminSettingsNav = {
  section: "Admin",
  items: [
    { href: "/admin/plans", label: "Plans & billing", icon: Sliders },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ],
};

export function Sidebar({ isAdmin, orgName }: { isAdmin: boolean; orgName: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const groups = isAdmin ? [...adminNavGroups, adminSettingsNav] : learnerNavGroups;

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col bg-gradient-to-b from-navy-900 via-navy-800 to-navy-700 text-white md:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-azure-bright to-gold text-sm font-black text-navy-900">
          F
        </span>
        <div className="leading-tight">
          <div className="text-sm font-bold">Microsoft AI FDE</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400">
            Program Portal
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {groups.map((g) => (
          <div key={g.section}>
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400/80">
              {g.section}
            </div>
            <div className="space-y-0.5">
              {g.items.map((it) => {
                const Icon = it.icon;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`nav-link ${isActive(it.href) ? "nav-link-active" : ""}`}
                  >
                    <Icon size={17} strokeWidth={2} />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <GraduationCap size={15} />
          <span className="truncate">{orgName}</span>
        </div>
      </div>
    </aside>
  );
}
