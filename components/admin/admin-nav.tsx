"use client";

import Link from "next/link";
import { FolderKanban, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:pt-5" aria-label="Admin navigation">
      {navigation.map((item) => {
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;

        return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm font-medium transition ${active ? "bg-white/[0.06] text-white" : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-200"}`}><Icon size={17} className={active ? "text-cyan-300" : undefined}/>{item.label}</Link>;
      })}
    </nav>
  );
}
