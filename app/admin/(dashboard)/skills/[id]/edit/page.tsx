import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { deleteSkill, updateSkill } from "../../../content-actions";
import { ContentDeleteButton } from "@/components/admin/content-delete-button";
import { SkillForm } from "@/components/admin/skill-form";
import { idSchema } from "@/lib/content-schema";
import { createClient } from "@/lib/supabase/server";
import type { Skill } from "@/types/content";
export const metadata: Metadata = { title: "Edit skill", robots: { index: false, follow: false } }; export const instant = false;
export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) { await connection(); const id = idSchema.safeParse((await params).id); if (!id.success) notFound(); const supabase = await createClient(); const { data } = await supabase.from("skills").select("id, name, category, proficiency, icon, display_order, is_visible, created_at, updated_at").eq("id", id.data).maybeSingle(); if (!data) notFound(); const skill = data as Skill; return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-4xl"><Link href="/admin/skills" className="text-link"><ArrowLeft/>Skills</Link><header className="mb-10 mt-8 border-b border-border pb-8"><p className="eyebrow">Skill settings</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Edit {skill.name}</h1></header><SkillForm action={updateSkill.bind(null, skill.id)} skill={skill}/><section className="mt-14 rounded-lg border border-destructive/20 bg-destructive/[.035] p-6"><h2 className="text-lg font-semibold">Danger zone</h2><p className="mb-5 mt-2 text-sm text-muted-foreground">Permanently remove this skill from the CMS.</p><ContentDeleteButton action={deleteSkill.bind(null, skill.id)} label="skill" name={skill.name}/></section></div></main>; }
