import type { Project } from "@/types/project";
import type { ProjectFormValues } from "@/types/project-form";

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function projectToFormValues(project: Project): ProjectFormValues {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    content: project.content ?? "",
    technologies: project.technologies?.join(", ") ?? "",
    github_url: project.github_url ?? "",
    live_url: project.live_url ?? "",
    thumbnail_url: project.thumbnail_url ?? "",
    status: project.status,
    featured: project.featured,
    display_order: project.display_order,
  };
}
