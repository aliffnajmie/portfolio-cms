import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return <div className="min-h-svh bg-background text-foreground lg:grid lg:grid-cols-[17rem_1fr]">
    <aside className="border-b border-white/10 bg-slate-950 lg:sticky lg:top-0 lg:h-svh lg:border-b-0 lg:border-r"><div className="flex h-full flex-col"><div className="flex h-[4.5rem] items-center justify-between px-6 lg:border-b lg:border-white/10"><Link href="/admin" className="font-semibold tracking-tight text-white"><span className="text-cyan-300">AN</span> / Portfolio CMS</Link><span className="border border-cyan-300/20 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300">Admin</span></div><AdminNav/><div className="hidden border-t border-white/10 p-4 lg:block"><p className="truncate px-3 pb-3 text-xs text-slate-500" title={user.email}>{user.email}</p><form action={logout}><button className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white" type="submit"><LogOut size={16}/>Sign out</button></form></div></div></aside>
    <div className="min-w-0"><header className="flex h-[4.5rem] items-center justify-between border-b border-white/10 px-6 lg:px-10"><div><p className="text-sm font-medium text-white">Dashboard</p><p className="mt-0.5 max-w-[12rem] truncate text-xs text-slate-500 sm:max-w-none">{user.email}</p></div><form action={logout} className="lg:hidden"><button type="submit" className="icon-link" aria-label="Sign out"><LogOut size={18}/></button></form></header>{children}</div>
  </div>;
}
