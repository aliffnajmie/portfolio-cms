import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectsState } from "@/components/portfolio/projects-state";
import { SiteFooter } from "@/components/portfolio/site-footer";
import { SiteHeader } from "@/components/portfolio/site-header";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { ExperienceTimeline } from "@/components/portfolio/experience-timeline";
import { ProfileHero } from "@/components/portfolio/profile-hero";
import { AboutSection } from "@/components/portfolio/about-section";
import { ContactSection } from "@/components/portfolio/contact-section";
import { Button } from "@/components/ui/button";
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
    <ContactSection profile={profile.profile}/>
  </main><SiteFooter/></div>;
}
