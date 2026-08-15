import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/project";

const publicProjectColumns = "id, title, slug, summary, content, status, featured, technologies, github_url, live_url, thumbnail_url, display_order, updated_at, created_at";

export type PublicProjectsResult = {
  projects: Project[];
  error: boolean;
};

export type PublicProjectResult = {
  project: Project | null;
  error: boolean;
};

export async function getPublishedProjects(options: { featured?: boolean } = {}): Promise<PublicProjectsResult> {
  const supabase = await createClient();
  let query = supabase.from("projects").select(publicProjectColumns).eq("status", "published");

  if (options.featured) query = query.eq("featured", true);

  const { data, error } = await query.order("display_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to load published projects", {
      code: error.code,
      message: error.message,
      featuredOnly: Boolean(options.featured),
    });
    return { projects: [], error: true };
  }

  return { projects: (data ?? []) as Project[], error: false };
}

export const getPublishedProjectBySlug = cache(async (slug: string): Promise<PublicProjectResult> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select(publicProjectColumns).eq("status", "published").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("Failed to load published project", {
      code: error.code,
      message: error.message,
      slug,
    });
    return { project: null, error: true };
  }

  return { project: data as Project | null, error: false };
});
