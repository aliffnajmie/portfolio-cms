"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { projectFormData, projectSchema } from "@/lib/project-schema";
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

  revalidatePath("/admin/projects", "layout");
  redirect("/admin/projects");
}
