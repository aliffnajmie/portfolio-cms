"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { projectFormData, projectIdSchema, projectSchema } from "@/lib/project-schema";
import { deleteManagedProjectImage, uploadProjectImage, validateProjectImage } from "@/lib/supabase/project-images";
import { createClient } from "@/lib/supabase/server";
import type { DeleteProjectState, ProjectFormState } from "@/types/project-form";

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/admin/login");
  return { supabase, user };
}

export async function updateProject(
  projectId: string,
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const { supabase, user } = await getAuthenticatedClient();
  const idResult = projectIdSchema.safeParse(projectId);
  if (!idResult.success) return { errors: {}, formError: "This project could not be updated." };

  const projectResult = projectSchema.safeParse(projectFormData(formData));
  if (!projectResult.success) {
    return { errors: projectResult.error.flatten().fieldErrors, formError: null };
  }

  const image = validateProjectImage(formData.get("thumbnail_image"));
  if (image.error) return { errors: { thumbnail_image: [image.error] }, formError: null };

  const { data: existingProject, error: existingProjectError } = await supabase.from("projects").select("slug, thumbnail_url").eq("id", idResult.data).maybeSingle();
  if (existingProjectError || !existingProject) {
    console.error("Failed to load project before update", {
      code: existingProjectError?.code ?? "NO_MATCHING_ROW",
      message: existingProjectError?.message ?? "No project was returned before update",
      projectId: idResult.data,
      userId: user.id,
    });
    return { errors: {}, formError: "The project couldn't be updated. Please try again." };
  }

  const upload = image.file
    ? await uploadProjectImage(supabase, image.file, image.extension)
    : { path: null, publicUrl: null, error: null };
  if (upload.error || (image.file && !upload.publicUrl)) {
    console.error("Failed to upload replacement project thumbnail", { message: upload.error?.message, projectId: idResult.data, userId: user.id });
    return { errors: { thumbnail_image: ["The image couldn't be uploaded. Please try again."] }, formError: null };
  }
  const removeThumbnail = formData.get("remove_thumbnail") === "on";
  const thumbnailUrl = upload.publicUrl ?? (removeThumbnail ? null : existingProject.thumbnail_url);

  async function cleanUpNewUpload() {
    if (!upload.publicUrl) return;
    const cleanup = await deleteManagedProjectImage(supabase, upload.publicUrl);
    if (cleanup.error) console.error("Failed to clean up replacement thumbnail", { message: cleanup.error.message, projectId: idResult.data, userId: user.id });
  }

  const updatePayload = {
    title: projectResult.data.title,
    slug: projectResult.data.slug,
    summary: projectResult.data.summary,
    content: projectResult.data.content,
    thumbnail_url: thumbnailUrl,
    technologies: projectResult.data.technologies,
    github_url: projectResult.data.github_url,
    live_url: projectResult.data.live_url,
    status: projectResult.data.status,
    featured: projectResult.data.featured,
    display_order: projectResult.data.display_order,
  };

  const { data, error } = await supabase.from("projects").update(updatePayload).eq("id", idResult.data).select("id, title, slug, summary, content, thumbnail_url, technologies, github_url, live_url, status, featured, display_order").maybeSingle();
  if (error || !data) {
    await cleanUpNewUpload();
    console.error("Failed to update admin project", {
      code: error?.code ?? "NO_MATCHING_ROW",
      message: error?.message ?? "No project was returned after update",
      projectId: idResult.data,
      userId: user.id,
    });

    if (error?.code === "23505") {
      return { errors: { slug: ["A project with this slug already exists."] }, formError: null };
    }

    return { errors: {}, formError: "The project couldn't be updated. Please try again." };
  }

  const mismatchedFields = (Object.keys(updatePayload) as Array<keyof typeof updatePayload>).filter((field) => {
    const submitted = updatePayload[field];
    const persisted = data[field];
    return Array.isArray(submitted)
      ? JSON.stringify(submitted) !== JSON.stringify(persisted)
      : submitted !== persisted;
  });

  if (mismatchedFields.length > 0) {
    await cleanUpNewUpload();
    console.error("Project update did not persist all submitted fields", {
      projectId: idResult.data,
      userId: user.id,
      mismatchedFields,
    });
    return { errors: {}, formError: "The project couldn't be updated. Please try again." };
  }

  if (existingProject.thumbnail_url && existingProject.thumbnail_url !== thumbnailUrl && (upload.publicUrl || removeThumbnail)) {
    const cleanup = await deleteManagedProjectImage(supabase, existingProject.thumbnail_url);
    if (cleanup.error) console.error("Failed to remove previous project thumbnail", { message: cleanup.error.message, projectId: idResult.data, userId: user.id });
  }

  revalidatePath("/admin/projects", "layout");
  revalidatePath(`/admin/projects/${idResult.data}/edit`);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${existingProject.slug}`);
  revalidatePath(`/projects/${projectResult.data.slug}`);
  redirect("/admin/projects");
}

export async function deleteProject(
  projectId: string,
  _previousState: DeleteProjectState,
  _formData: FormData,
): Promise<DeleteProjectState> {
  void _previousState;
  void _formData;
  const { supabase, user } = await getAuthenticatedClient();
  const idResult = projectIdSchema.safeParse(projectId);
  if (!idResult.success) return { error: "This project could not be deleted." };

  const { data, error } = await supabase.from("projects").delete().eq("id", idResult.data).select("id, slug, thumbnail_url").maybeSingle();
  if (error || !data) {
    console.error("Failed to delete admin project", {
      code: error?.code ?? "NO_MATCHING_ROW",
      message: error?.message ?? "No project was returned after deletion",
      projectId: idResult.data,
      userId: user.id,
    });
    return { error: "The project couldn't be deleted. Please try again." };
  }

  const cleanup = await deleteManagedProjectImage(supabase, data.thumbnail_url);
  if (cleanup.error) console.error("Failed to remove thumbnail after project deletion", { message: cleanup.error.message, projectId: idResult.data, userId: user.id });

  revalidatePath("/admin/projects", "layout");
  revalidatePath(`/admin/projects/${idResult.data}/edit`);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${data.slug}`);
  redirect("/admin/projects");
}
