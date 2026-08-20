import type { Metadata } from "next";
import { connection } from "next/server";
import { ProfileForm } from "@/components/admin/profile-form";
import { Alert } from "@/components/ui/alert";
import { getSiteProfile } from "@/lib/profile-public";
export const metadata: Metadata = { title: "Profile", robots: { index: false, follow: false } }; export const instant = false;
export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ success?: string }> }) { await connection(); const [{ profile, error }, params] = await Promise.all([getSiteProfile(), searchParams]); return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-5xl"><header className="border-b border-border pb-8"><p className="eyebrow">Site settings</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Profile and About</h1><p className="mt-3 max-w-2xl text-muted-foreground">Manage the identity, introduction, public links, image, and résumé used throughout the portfolio.</p></header>{params.success === "saved" && <Alert className="mt-6 border-emerald-400/25 bg-emerald-400/[.06] text-emerald-200">Profile saved successfully.</Alert>}{error ? <Alert variant="destructive" className="mt-6">The profile couldn&apos;t be loaded. Apply the profile migration or try again.</Alert> : <div className="mt-8"><ProfileForm profile={profile}/></div>}</div></main>; }
