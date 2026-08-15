import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, FolderKanban, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";

export const metadata: Metadata = { title: "Projects", robots: { index: false, follow: false } };
export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("en-MY", { day: "2-digit", month: "short", year: "numeric" });

function StatusBadge({ status }: { status: Project["status"] }) {
  const published = status === "published";
  return <span className={`inline-flex items-center gap-2 border px-2.5 py-1 text-xs font-medium capitalize ${published ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300" : "border-amber-300/20 bg-amber-300/[0.06] text-amber-200"}`}><span className={`size-1.5 rounded-full ${published ? "bg-emerald-300" : "bg-amber-200"}`}/>{published ? "Published" : "Draft"}</span>;
}

function Technologies({ items }: { items: Project["technologies"] }) {
  if (!items?.length) return <span className="text-slate-600">—</span>;
  return <div className="flex flex-wrap gap-1.5">{items.map((technology) => <span key={technology} className="border border-white/10 px-2 py-1 text-[11px] text-slate-400">{technology}</span>)}</div>;
}

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("id, title, status, featured, technologies, display_order, updated_at, created_at").order("display_order", { ascending: true }).order("created_at", { ascending: false });

  if (error) console.error("Failed to load admin project list", { code: error.code, message: error.message });
  const projects = (data ?? []) as Project[];

  return <main className="p-6 sm:p-8 lg:p-10"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Content</p><h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Projects</h1><p className="mt-3 text-slate-400">Manage the work displayed across your portfolio.</p></div><Link href="/admin/projects/new" className="button-primary justify-center"><Plus size={17}/>New project</Link></div>
    {error ? <section className="mt-8 flex min-h-64 flex-col items-center justify-center border border-red-400/15 bg-red-400/[0.025] px-6 text-center"><AlertCircle className="text-red-300" size={24}/><h2 className="mt-5 text-lg font-semibold text-white">Projects couldn&apos;t be loaded</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Something went wrong while retrieving your projects. Please refresh the page or try again shortly.</p></section>
    : projects.length === 0 ? <section className="mt-8 flex min-h-72 flex-col items-center justify-center border border-dashed border-white/15 bg-slate-950/25 px-6 text-center"><div className="grid size-12 place-items-center border border-cyan-300/20 bg-cyan-300/[0.04] text-cyan-300"><FolderKanban size={22}/></div><h2 className="mt-6 text-xl font-semibold text-white">No projects yet</h2><p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Your project library is empty. Project creation will be available in the next milestone.</p></section>
    : <><div className="mt-8 hidden overflow-hidden border border-white/10 md:block"><table className="w-full text-left"><thead className="border-b border-white/10 bg-white/[0.025] font-mono text-[10px] uppercase tracking-[.14em] text-slate-500"><tr><th className="px-5 py-4 font-medium">Project</th><th className="px-5 py-4 font-medium">Status</th><th className="px-5 py-4 font-medium">Technologies</th><th className="px-5 py-4 text-center font-medium">Order</th><th className="px-5 py-4 text-right font-medium">Updated</th></tr></thead><tbody className="divide-y divide-white/10">{projects.map((project) => <tr key={project.id} className="bg-slate-950/20"><td className="px-5 py-5"><p className="font-medium text-white">{project.title}</p>{project.featured && <span className="mt-2 inline-block border border-cyan-300/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cyan-300">Featured</span>}</td><td className="px-5 py-5"><StatusBadge status={project.status}/></td><td className="max-w-xs px-5 py-5"><Technologies items={project.technologies}/></td><td className="px-5 py-5 text-center font-mono text-sm text-slate-400">{project.display_order}</td><td className="whitespace-nowrap px-5 py-5 text-right text-sm text-slate-500">{dateFormatter.format(new Date(project.updated_at))}</td></tr>)}</tbody></table></div>
    <div className="mt-8 space-y-4 md:hidden">{projects.map((project) => <article key={project.id} className="border border-white/10 bg-slate-950/25 p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-medium text-white">{project.title}</h2><div className="mt-3 flex flex-wrap items-center gap-2"><StatusBadge status={project.status}/>{project.featured && <span className="border border-cyan-300/20 px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-300">Featured</span>}</div></div><span className="font-mono text-xs text-slate-500">#{project.display_order}</span></div><div className="mt-5"><Technologies items={project.technologies}/></div><p className="mt-5 border-t border-white/10 pt-4 text-xs text-slate-500">Updated {dateFormatter.format(new Date(project.updated_at))}</p></article>)}</div></>}
  </div></main>;
}
