import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createExperience } from "../../content-actions";
import { ExperienceForm } from "@/components/admin/experience-form";
export const metadata: Metadata = { title: "New experience", robots: { index: false, follow: false } };
export default function NewExperiencePage() { return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-4xl"><Link href="/admin/experience" className="text-link"><ArrowLeft/>Experience</Link><header className="mb-10 mt-8 border-b border-border pb-8"><p className="eyebrow">New role</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create experience</h1><p className="mt-3 text-muted-foreground">Add a role to the public career timeline.</p></header><ExperienceForm action={createExperience}/></div></main>; }
