export type ProjectStatus = "draft" | "published";

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string | null;
  status: ProjectStatus;
  featured: boolean;
  technologies: string[] | null;
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  display_order: number;
  updated_at: string;
  created_at: string;
};
