import type { Metadata } from "next";
import { ProjectCard } from "@/components/portfolio/project-card";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { projects } from "@/data/projects";
export const metadata: Metadata = { title: "Projects", description: "Selected software projects by Aliff Najmie." };
export default function ProjectsPage() { return <div className="min-h-screen"><SiteHeader/><main className="section-shell"><div className="max-w-3xl pb-16 pt-8"><p className="eyebrow">Project archive</p><h1 className="text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl">Selected work.</h1><p className="mt-6 text-lg leading-8 text-slate-400">A collection of product experiments and practical software built around real problems, thoughtful systems, and clear interfaces.</p></div><div className="grid gap-6 lg:grid-cols-2">{projects.map((project) => <ProjectCard key={project.slug} project={project}/>)}</div></main><SiteFooter/></div>; }
