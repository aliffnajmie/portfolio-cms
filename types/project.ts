export type ProjectStatus = "draft" | "published";

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  featured: boolean;
  technologies: string[] | null;
  display_order: number;
  updated_at: string;
  created_at: string;
};
