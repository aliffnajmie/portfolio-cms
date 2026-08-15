import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };
export const instant = false;

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return <main className="relative grid min-h-svh place-items-center overflow-hidden px-6 py-16"><div className="hero-grid absolute inset-0 opacity-30" aria-hidden="true"/><div className="relative w-full max-w-md"><Link href="/" className="inline-flex items-center text-sm font-semibold text-white"><span className="mr-2 text-cyan-300">AN</span> / Aliff Najmie</Link><section className="mt-10 border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-black/30 sm:p-10"><p className="eyebrow">Protected area</p><h1 className="text-3xl font-semibold tracking-tight text-white">Portfolio CMS</h1><p className="mt-3 leading-7 text-slate-400">Sign in with your administrator account to continue.</p><LoginForm/></section><p className="mt-6 text-center text-xs text-slate-600">Authorised access only</p></div></main>;
}
