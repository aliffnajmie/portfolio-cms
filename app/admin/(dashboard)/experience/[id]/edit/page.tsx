import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { deleteExperience, updateExperience } from "../../../content-actions";
import { ContentDeleteButton } from "@/components/admin/content-delete-button";
import { ExperienceForm } from "@/components/admin/experience-form";
import { idSchema } from "@/lib/content-schema";
import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/types/content";
export const metadata: Metadata = { title: "Edit experience", robots: { index: false, follow: false } }; export const instant = false;
export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) { await connection(); const id = idSchema.safeParse((await params).id); if (!id.success) notFound(); const supabase = await createClient(); const { data } = await supabase.from("experiences").select("id, company, position, location, employment_type, start_date, end_date, is_current, summary, achievements, technologies, company_url, display_order, is_visible, created_at, updated_at").eq("id", id.data).maybeSingle(); if (!data) notFound(); const experience = data as Experience; return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-4xl"><Link href="/admin/experience" className="text-link"><ArrowLeft/>Experience</Link><header className="mb-10 mt-8 border-b border-border pb-8"><p className="eyebrow">Experience settings</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Edit {experience.position}</h1></header><ExperienceForm action={updateExperience.bind(null, experience.id)} experience={experience}/><section className="mt-14 rounded-lg border border-destructive/20 bg-destructive/[.035] p-6"><h2 className="text-lg font-semibold">Danger zone</h2><p className="mb-5 mt-2 text-sm text-muted-foreground">Permanently remove this experience from the CMS.</p><ContentDeleteButton action={deleteExperience.bind(null, experience.id)} label="experience" name={`${experience.position} at ${experience.company}`}/></section></div></main>; }
