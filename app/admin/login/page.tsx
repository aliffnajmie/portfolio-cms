import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { createClient } from "@/lib/supabase/server";
import { BrandMark } from "@/components/portfolio/site-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };
export const instant = false;

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return <main className="relative grid min-h-svh place-items-center overflow-hidden px-5 py-16"><div className="soft-grid absolute inset-0 opacity-60" aria-hidden="true"/><div className="noise absolute inset-0"/><div className="relative w-full max-w-md"><Link href="/"><BrandMark/></Link><Card className="mt-8 border-primary/15"><CardContent className="p-7 sm:p-9"><p className="eyebrow">Protected workspace</p><h1 className="text-3xl font-semibold tracking-tight">Portfolio CMS</h1><p className="mt-3 leading-7 text-muted-foreground">Sign in with your administrator account to manage portfolio content.</p><LoginForm/></CardContent></Card><p className="mt-6 text-center text-xs text-muted-foreground">Authorised access only</p></div></main>;
}
