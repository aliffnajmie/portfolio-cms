import type { Metadata } from "next";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectsState } from "@/components/portfolio/projects-state";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { getPublishedProjects } from "@/lib/projects-public";

export const metadata: Metadata = { title: "Projects", description: "Selected software projects by Aliff Najmie." };
export const instant = false;

export default async function ProjectsPage() {
  const { projects, error } = await getPublishedProjects();
  return <div className="min-h-screen"><SiteHeader/><main className="section-shell"><div className="max-w-3xl pb-16 pt-8"><p className="eyebrow">Project archive</p><h1 className="text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl">Selected work.</h1><p className="mt-6 text-lg leading-8 text-slate-400">A collection of product experiments and practical software built around real problems, thoughtful systems, and clear interfaces.</p></div>{error ? <ProjectsState variant="error"/> : projects.length ? <div className="grid gap-6 lg:grid-cols-2">{projects.map((project) => <ProjectCard key={project.slug} project={project}/>)}</div> : <ProjectsState/>}</main><SiteFooter/></div>;
}
