"use client";

import Link from "next/link";
import { BriefcaseBusiness, FolderKanban, LayoutDashboard, Sparkles, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:pt-5" aria-label="Admin navigation">
      {navigation.map((item) => {
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;

        return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}><Icon size={17} className={active ? "text-primary" : undefined}/>{item.label}</Link>;
      })}
    </nav>
  );
}
