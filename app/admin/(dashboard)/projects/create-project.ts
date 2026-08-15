"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { projectFormData, projectSchema } from "@/lib/project-schema";
import { deleteManagedProjectImage, uploadProjectImage, validateProjectImage } from "@/lib/supabase/project-images";
import { createClient } from "@/lib/supabase/server";
import type { ProjectFormState } from "@/types/project-form";

export async function createProject(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) redirect("/admin/login");

  const result = projectSchema.safeParse(projectFormData(formData));
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, formError: null };
  }

  const image = validateProjectImage(formData.get("thumbnail_image"));
  if (image.error) return { errors: { thumbnail_image: [image.error] }, formError: null };

  const upload = image.file
    ? await uploadProjectImage(supabase, image.file, image.extension)
    : { path: null, publicUrl: null, error: null };
  if (upload.error || (image.file && !upload.publicUrl)) {
    console.error("Failed to upload project thumbnail", { message: upload.error?.message, userId: user.id });
    return { errors: { thumbnail_image: ["The image couldn't be uploaded. Please try again."] }, formError: null };
  }

  const { error } = await supabase.from("projects").insert({ ...result.data, thumbnail_url: upload.publicUrl });
  if (error) {
    if (upload.publicUrl) {
      const cleanup = await deleteManagedProjectImage(supabase, upload.publicUrl);
      if (cleanup.error) console.error("Failed to clean up thumbnail after project insert failure", { message: cleanup.error.message, userId: user.id });
    }
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

  revalidatePath("/admin/projects", "layout");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${result.data.slug}`);
  redirect("/admin/projects");
}
