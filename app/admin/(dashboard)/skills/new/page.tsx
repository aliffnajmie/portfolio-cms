import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSkill } from "../../content-actions";
import { SkillForm } from "@/components/admin/skill-form";
export const metadata: Metadata = { title: "New skill", robots: { index: false, follow: false } };
export default function NewSkillPage() { return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-4xl"><Link href="/admin/skills" className="text-link"><ArrowLeft/>Skills</Link><header className="mb-10 mt-8 border-b border-border pb-8"><p className="eyebrow">New capability</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create skill</h1><p className="mt-3 text-muted-foreground">Add a skill and choose where it belongs in the public grouping.</p></header><SkillForm action={createSkill}/></div></main>; }
