import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { ProjectForm } from "@/components/admin/project-form";
import { projectIdSchema } from "@/lib/project-schema";
import { projectToFormValues } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";
import { deleteProject, updateProject } from "@/app/admin/(dashboard)/projects/project-actions";
import type { Project } from "@/types/project";

export const metadata: Metadata = { title: "Edit project", robots: { index: false, follow: false } };
export const instant = false;

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const idResult = projectIdSchema.safeParse((await params).id);
  if (!idResult.success) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("id, title, slug, summary, content, technologies, github_url, live_url, thumbnail_url, status, featured, display_order, updated_at, created_at").eq("id", idResult.data).maybeSingle();

  if (error) {
    console.error("Failed to load project for editing", { code: error.code, message: error.message, projectId: idResult.data });
    return <main className="p-6 sm:p-8 lg:p-10"><div className="mx-auto max-w-4xl"><Link href="/admin/projects" className="text-link"><ArrowLeft size={16}/>Projects</Link><section className="mt-8 flex min-h-64 flex-col items-center justify-center border border-red-400/15 bg-red-400/[0.025] px-6 text-center"><AlertCircle className="text-red-300" size={24}/><h1 className="mt-5 text-lg font-semibold text-white">This project couldn&apos;t be loaded</h1><p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Please return to the project list and try again.</p></section></div></main>;
  }
  if (!data) notFound();

  const project = data as Project;
  const updateAction = updateProject.bind(null, project.id);
  const deleteAction = deleteProject.bind(null, project.id);

  return <main className="p-6 sm:p-8 lg:p-10"><div className="mx-auto max-w-4xl"><Link href="/admin/projects" className="text-link"><ArrowLeft size={16}/>Projects</Link><div className="mb-10 mt-8 border-b border-white/10 pb-8"><p className="eyebrow">Project settings</p><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Edit {project.title}</h1><p className="mt-3 max-w-2xl text-slate-400">Update project details, publishing status, and portfolio placement.</p></div><ProjectForm key={`${project.id}:${project.updated_at}`} action={updateAction} initialValues={projectToFormValues(project)} mode="edit"/><section className="mt-14 border-t border-red-400/15 pt-8"><h2 className="text-lg font-semibold text-white">Danger zone</h2><p className="mb-5 mt-2 max-w-xl text-sm leading-6 text-slate-500">Permanently remove this project from the CMS. This cannot be undone.</p><DeleteProjectButton action={deleteAction} title={project.title}/></section></div></main>;
}
