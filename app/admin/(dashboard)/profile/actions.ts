"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { profileFormData, profileSchema } from "@/lib/profile-schema";
import { getSiteProfile, siteProfileColumns } from "@/lib/profile-public";
import { PROFILE_IMAGE_PATH, RESUME_PATH, removeProfileAsset, uploadProfileAsset, validateProfileImage, validateResume } from "@/lib/supabase/profile-assets";
import { createClient } from "@/lib/supabase/server";
import type { ProfileFormState } from "@/types/profile";

export async function saveProfile(_state: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");

  const parsed = profileSchema.safeParse(profileFormData(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, formError: null };
  const image = validateProfileImage(formData.get("profile_image"));
  const resume = validateResume(formData.get("resume_file"));
  if (image.error || resume.error) return { errors: { ...(image.error ? { profile_image: [image.error] } : {}), ...(resume.error ? { resume_file: [resume.error] } : {}) }, formError: null };

  const current = await getSiteProfile();
  if (current.error) return { errors: {}, formError: "The existing profile couldn't be loaded. Please try again." };
  const removeImage = formData.get("remove_profile_image") === "on";
  const removeResume = formData.get("remove_resume") === "on";

  const imageUpload = image.file ? await uploadProfileAsset(supabase, PROFILE_IMAGE_PATH, image.file) : { publicUrl: null, error: null };
  if (imageUpload.error) { console.error("Failed to upload profile image", { message: imageUpload.error.message, userId: user.id }); return { errors: { profile_image: ["The profile image couldn't be uploaded. Please try again."] }, formError: null }; }
  const resumeUpload = resume.file ? await uploadProfileAsset(supabase, RESUME_PATH, resume.file) : { publicUrl: null, error: null };
  if (resumeUpload.error) { console.error("Failed to upload résumé", { message: resumeUpload.error.message, userId: user.id }); return { errors: { resume_file: ["The résumé couldn't be uploaded. Please try again."] }, formError: null }; }

  const payload = {
    ...parsed.data,
    profile_image_url: imageUpload.publicUrl ?? (removeImage ? null : current.profile?.profile_image_url ?? null),
    resume_url: resumeUpload.publicUrl ?? (removeResume ? null : current.profile?.resume_url ?? null),
  };
  const result = current.profile
    ? await supabase.from("site_profile").update(payload).eq("id", current.profile.id).select(siteProfileColumns).maybeSingle()
    : await supabase.from("site_profile").insert(payload).select(siteProfileColumns).maybeSingle();
  if (result.error || !result.data) { console.error("Failed to save site profile", { code: result.error?.code, message: result.error?.message, userId: user.id }); return { errors: {}, formError: result.error?.code === "23505" ? "A profile already exists. Refresh the page before editing it." : "The profile couldn't be saved. Please try again." }; }

  if (removeImage && !image.file) { const cleanup = await removeProfileAsset(supabase, PROFILE_IMAGE_PATH); if (cleanup.error) console.error("Failed to remove profile image", { message: cleanup.error.message, userId: user.id }); }
  if (removeResume && !resume.file) { const cleanup = await removeProfileAsset(supabase, RESUME_PATH); if (cleanup.error) console.error("Failed to remove résumé", { message: cleanup.error.message, userId: user.id }); }
  revalidatePath("/");
  revalidatePath("/admin/profile");
  redirect("/admin/profile?success=saved");
}
