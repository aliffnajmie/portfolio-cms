"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { normalizeSlug } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";
import type { ProjectFormState } from "@/types/project-form";

const optionalUrl = z.string().trim().refine(
  (value) => value === "" || URL.canParse(value),
  "Enter a valid URL, including https://.",
).transform((value) => value || null);

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title must be 120 characters or fewer."),
  slug: z.string().trim().transform(normalizeSlug).pipe(z.string().min(1, "Slug is required.").max(120, "Slug must be 120 characters or fewer.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.")),
  summary: z.string().trim().min(1, "Summary is required.").max(500, "Summary must be 500 characters or fewer."),
  content: z.string().trim().transform((value) => value || null),
  technologies: z.string().transform((value) => {
    const seen = new Set<string>();
    return value.split(",").map((item) => item.trim()).filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }),
  github_url: optionalUrl,
  live_url: optionalUrl,
  thumbnail_url: optionalUrl,
  status: z.enum(["draft", "published"], { message: "Choose Draft or Published." }),
  featured: z.string().optional().transform((value) => value === "on"),
  display_order: z.coerce.number().int("Display order must be a whole number."),
});

export async function createProject(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) redirect("/admin/login");

  const result = projectSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, formError: null };
  }

  const { error } = await supabase.from("projects").insert(result.data);
  if (error) {
    console.error("Failed to create admin project", {
      code: error.code,
      message: error.message,
      userId: user.id,
    });

    if (error.code === "23505") {
      return { errors: { slug: ["A project with this slug already exists."] }, formError: null };
    }

    return { errors: {}, formError: "The project couldn't be created. Please try again." };
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
