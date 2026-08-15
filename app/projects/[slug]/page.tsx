import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectsState } from "@/components/portfolio/projects-state";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { getPublishedProjectBySlug } from "@/lib/projects-public";
import { getManagedProjectImagePath } from "@/lib/supabase/project-images";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { project, error } = await getPublishedProjectBySlug((await params).slug);
  if (error) return { title: "Project", description: "Project by Aliff Najmie." };
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { project, error } = await getPublishedProjectBySlug((await params).slug);
  if (error) return <div className="min-h-screen"><SiteHeader/><main className="section-shell"><ProjectsState variant="error"/></main><SiteFooter/></div>;
  if (!project) notFound();

  const year = new Date(project.created_at).getFullYear();
  return <div className="min-h-screen"><SiteHeader/><main><div className="section-shell pb-12"><Link href="/projects" className="text-link"><ArrowLeft size={16}/> All projects</Link><div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[.18em] text-cyan-300"><span>Published</span><span className="text-slate-700">/</span><span>{year}</span></div><h1 className="text-5xl font-semibold tracking-[-.045em] text-white sm:text-7xl">{project.title}</h1><p className="mt-7 max-w-3xl text-xl leading-9 text-slate-400">{project.summary}</p></div>{project.live_url || project.github_url ? <div className="flex flex-wrap gap-3">{project.live_url && <a className="button-primary" href={project.live_url} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={16}/></a>}{project.github_url && <a className="button-secondary" href={project.github_url} target="_blank" rel="noreferrer"><Github size={17}/> Code</a>}</div> : null}</div></div><div className="mx-auto max-w-6xl px-6 lg:px-8"><div className="relative aspect-[16/8] overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-400/10 to-slate-950">{project.thumbnail_url ? <Image src={project.thumbnail_url} alt={`${project.title} project thumbnail`} fill priority sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover" unoptimized={!getManagedProjectImagePath(project.thumbnail_url)}/> : <div className="absolute inset-[10%] border border-white/10 bg-slate-950/80 p-8"><div className="h-3 w-1/3 bg-white/10"/><div className="mt-8 grid h-2/3 grid-cols-3 gap-4"><div className="col-span-2 border border-cyan-300/10 bg-cyan-300/[.025]"/><div className="border border-white/5 bg-white/[.02]"/></div></div>}</div></div><section className="section-shell grid gap-12 lg:grid-cols-[1fr_2fr]"><div><p className="eyebrow">The project</p>{project.technologies?.length ? <div className="flex flex-wrap gap-2">{project.technologies.map((tech) => <span className="border border-white/10 px-3 py-1.5 text-xs text-slate-400" key={tech}>{tech}</span>)}</div> : <p className="text-sm text-slate-500">Technology details coming soon.</p>}</div><div><h2 className="text-3xl font-semibold text-white">Built for clarity and momentum.</h2><p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-8 text-slate-400">{project.content || project.summary}</p></div></section></main><SiteFooter/></div>;
}
