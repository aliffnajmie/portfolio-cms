import { z } from "zod";
import { normalizeSlug } from "@/lib/projects";

const optionalUrl = z.string().trim().refine(
  (value) => value === "" || URL.canParse(value),
  "Enter a valid URL, including https://.",
).transform((value) => value || null);

export const projectIdSchema = z.string().uuid("Invalid project identifier.");

export const projectSchema = z.object({
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

export function projectFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    technologies: formData.get("technologies"),
    github_url: formData.get("github_url"),
    live_url: formData.get("live_url"),
    thumbnail_url: formData.get("thumbnail_url"),
    status: formData.get("status"),
    featured: formData.get("featured") ?? undefined,
    display_order: formData.get("display_order"),
  };
}
