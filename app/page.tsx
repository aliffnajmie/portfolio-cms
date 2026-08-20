import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectsState } from "@/components/portfolio/projects-state";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { ExperienceTimeline } from "@/components/portfolio/experience-timeline";
import { ProfileHero } from "@/components/portfolio/profile-hero";
import { AboutSection } from "@/components/portfolio/about-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedProjects } from "@/lib/projects-public";
import { getVisibleExperiences, getVisibleSkills } from "@/lib/content-public";
import { getSiteProfile } from "@/lib/profile-public";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> { const { profile } = await getSiteProfile(); if (!profile) return {}; return { title: `${profile.full_name} — ${profile.professional_title}`, description: profile.short_bio, keywords: [profile.full_name, profile.professional_title, "Software Developer", "Portfolio"] }; }

export default async function Home() {
  const [{ projects, error }, skills, experiences, profile] = await Promise.all([getPublishedProjects({ featured: true }), getVisibleSkills(), getVisibleExperiences(), getSiteProfile()]);
  return <div className="min-h-screen"><SiteHeader/><main>
    <ProfileHero profile={profile.profile} error={profile.error}/>
    <AboutSection profile={profile.profile}/>
    <section id="projects" className="section-shell"><div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Selected work</p><h2 className="section-title max-w-2xl">Purposeful products, carefully engineered.</h2></div><Button variant="ghost" asChild><Link href="/projects">View project archive <ArrowRight/></Link></Button></div>{error ? <ProjectsState variant="error" featured/> : projects.length ? <div className="cascade-grid grid gap-6 lg:grid-cols-2">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index}/>)}</div> : <ProjectsState featured/>}</section>
    <SkillsSection skills={skills.data} error={skills.error}/>
    <ExperienceTimeline experiences={experiences.data} error={experiences.error}/>
    <section id="contact" className="page-shell pb-6 sm:pb-8"><Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[.1] via-card to-card"><div className="soft-grid absolute inset-0 opacity-40"/><CardContent className="relative px-6 py-14 sm:px-10 sm:py-16 lg:flex lg:items-end lg:justify-between lg:px-14"><div><p className="eyebrow">Start a conversation</p><h2 className="max-w-3xl text-4xl font-semibold tracking-[-.04em] sm:text-6xl">Have a useful idea? Let&apos;s build it well.</h2>{profile.profile?.availability_message && <p className="mt-5 max-w-xl text-muted-foreground">{profile.profile.availability_message}</p>}</div><div className="mt-10 flex flex-wrap gap-2 lg:mt-0">{profile.profile?.email && <Button size="icon" variant="outline" asChild><a href={`mailto:${profile.profile.email}`} aria-label={`Email ${profile.profile.full_name}`}><Mail/></a></Button>}{profile.profile?.github_url && <Button size="icon" variant="outline" asChild><a href={profile.profile.github_url} target="_blank" rel="noreferrer" aria-label="GitHub"><Github/></a></Button>}{profile.profile?.linkedin_url && <Button size="icon" variant="outline" asChild><a href={profile.profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a></Button>}{profile.profile?.email && <Button asChild><a href={`mailto:${profile.profile.email}`}>Get in touch <ArrowUpRight/></a></Button>}</div></CardContent></Card></section>
  </main><SiteFooter/></div>;
}
