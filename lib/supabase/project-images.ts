import type { SupabaseClient } from "@supabase/supabase-js";

export const PROJECT_IMAGES_BUCKET = "project-images";
export const MAX_PROJECT_IMAGE_SIZE = 5 * 1024 * 1024;

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type ImageValidationResult =
  | { file: File; extension: string; error: null }
  | { file: null; extension: null; error: string | null };

export function validateProjectImage(value: FormDataEntryValue | null): ImageValidationResult {
  if (!(value instanceof File) || value.size === 0) return { file: null, extension: null, error: null };
  const extension = imageExtensions[value.type];
  if (!extension) return { file: null, extension: null, error: "Choose a JPEG, PNG, or WebP image." };
  if (value.size > MAX_PROJECT_IMAGE_SIZE) return { file: null, extension: null, error: "Image must be 5 MB or smaller." };
  return { file: value, extension, error: null };
}

export async function uploadProjectImage(supabase: SupabaseClient, file: File, extension: string) {
  const path = `projects/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { path: null, publicUrl: null, error };
  const { data } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl, error: null };
}

export function getManagedProjectImagePath(url: string | null) {
  if (!url || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const storageUrl = new URL(url);
    const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const prefix = `/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/`;
    if (storageUrl.origin !== supabaseUrl.origin || !storageUrl.pathname.startsWith(prefix)) return null;
    const path = decodeURIComponent(storageUrl.pathname.slice(prefix.length));
    return /^projects\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpg|png|webp)$/i.test(path) ? path : null;
  } catch {
    return null;
  }
}

export async function deleteManagedProjectImage(supabase: SupabaseClient, url: string | null) {
  const path = getManagedProjectImagePath(url);
  if (!path) return { deleted: false, error: null };
  const { error } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([path]);
  return { deleted: !error, error };
}
