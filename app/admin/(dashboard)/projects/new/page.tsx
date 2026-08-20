import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "@/app/admin/(dashboard)/projects/create-project";

export const metadata: Metadata = { title: "New project", robots: { index: false, follow: false } };

export default function NewProjectPage() {
  return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-4xl"><Link href="/admin/projects" className="text-link"><ArrowLeft size={16}/>Projects</Link><div className="mb-10 mt-8 border-b border-border pb-8"><p className="eyebrow">New entry</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create project</h1><p className="mt-3 max-w-2xl text-muted-foreground">Add a project to your CMS. You can keep it as a draft until it is ready to publish.</p></div><ProjectForm action={createProject}/></div></main>;
}
