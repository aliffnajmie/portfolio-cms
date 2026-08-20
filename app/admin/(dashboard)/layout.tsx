import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { createClient } from "@/lib/supabase/server";
import { BrandMark } from "@/components/portfolio/site-header";
import { Button } from "@/components/ui/button";

export const instant = false;

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return <div className="min-h-svh lg:grid lg:grid-cols-[17rem_1fr]">
    <aside className="border-b border-border/70 bg-card/65 backdrop-blur-xl lg:sticky lg:top-0 lg:h-svh lg:border-b-0 lg:border-r"><div className="flex h-full flex-col"><div className="flex h-[4.5rem] items-center justify-between px-5 lg:border-b lg:border-border"><Link href="/admin"><BrandMark cms/></Link><span className="rounded border border-primary/25 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">Admin</span></div><AdminNav/><div className="hidden border-t border-border p-4 lg:block"><p className="truncate px-3 pb-3 text-xs text-muted-foreground" title={user.email}>{user.email}</p><form action={logout}><Button variant="ghost" className="w-full justify-start text-muted-foreground" type="submit"><LogOut/>Sign out</Button></form></div></div></aside>
    <div className="min-w-0"><header className="flex h-[4.5rem] items-center justify-between border-b border-border/70 bg-background/50 px-5 backdrop-blur lg:px-10"><div><p className="text-sm font-semibold">Dashboard</p><p className="mt-0.5 max-w-[12rem] truncate text-xs text-muted-foreground sm:max-w-none">{user.email}</p></div><form action={logout} className="lg:hidden"><Button type="submit" size="icon" variant="outline" aria-label="Sign out"><LogOut/></Button></form></header>{children}</div>
  </div>;
}
