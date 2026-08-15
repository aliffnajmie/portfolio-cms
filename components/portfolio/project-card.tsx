import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getManagedProjectImagePath } from "@/lib/supabase/project-images";
import type { Project } from "@/types/project";

const accents = ["from-blue-500/20", "from-cyan-400/20", "from-indigo-500/20"];

function ProjectPlaceholder({ accent }: { accent: string }) {
  return <div className={`absolute inset-0 bg-gradient-to-br ${accent} to-slate-950`}><div className="absolute inset-8 border border-white/10 bg-slate-950/75 p-5 shadow-2xl sm:inset-12"><div className="flex gap-1.5 border-b border-white/10 pb-4"><span className="size-1.5 rounded-full bg-cyan-300/70"/><span className="size-1.5 rounded-full bg-blue-400/50"/><span className="size-1.5 rounded-full bg-white/20"/></div><div className="mt-5 grid grid-cols-3 gap-3"><div className="col-span-2 h-3 bg-white/10"/><div className="h-3 bg-cyan-300/20"/><div className="col-span-3 mt-2 h-20 border border-white/5 bg-white/[0.025]"/></div></div></div>;
}

export function ProjectCard({ project }: { project: Project }) {
  const accent = accents[project.id.charCodeAt(0) % accents.length];
  const year = new Date(project.created_at).getFullYear();
  return <article className="group overflow-hidden border border-white/10 bg-slate-950/40 transition-colors hover:border-cyan-300/30"><Link href={`/projects/${project.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><div className="relative aspect-[16/10] overflow-hidden">{project.thumbnail_url ? <Image src={project.thumbnail_url} alt={`${project.title} project thumbnail`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.02]" unoptimized={!getManagedProjectImagePath(project.thumbnail_url)}/> : <ProjectPlaceholder accent={accent}/>}<span className="absolute right-4 top-4 bg-slate-950/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-200">Published</span></div><div className="p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="mb-3 font-mono text-xs text-slate-500">{year}</p><h3 className="text-2xl font-semibold text-white">{project.title}</h3></div><ArrowUpRight className="text-slate-500 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300" size={21}/></div><p className="mt-4 leading-7 text-slate-400">{project.summary}</p>{project.technologies?.length ? <div className="mt-6 flex flex-wrap gap-2">{project.technologies.map((tech) => <span key={tech} className="border border-white/10 px-2.5 py-1 text-xs text-slate-400">{tech}</span>)}</div> : null}</div></Link></article>;
}
