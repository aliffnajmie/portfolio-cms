import type { SupabaseClient } from "@supabase/supabase-js";

export const PORTFOLIO_ASSETS_BUCKET = "portfolio-assets";
export const PROFILE_IMAGE_PATH = "profile/avatar";
export const RESUME_PATH = "profile/resume.pdf";
export const MAX_PROFILE_ASSET_SIZE = 5 * 1024 * 1024;

type FileValidation = { file: File | null; error: string | null };
export function validateProfileImage(value: FormDataEntryValue | null): FileValidation { if (!(value instanceof File) || value.size === 0) return { file: null, error: null }; if (!["image/jpeg", "image/png", "image/webp"].includes(value.type)) return { file: null, error: "Choose a JPEG, PNG, or WebP image." }; if (value.size > MAX_PROFILE_ASSET_SIZE) return { file: null, error: "Profile image must be 5 MB or smaller." }; return { file: value, error: null }; }
export function validateResume(value: FormDataEntryValue | null): FileValidation { if (!(value instanceof File) || value.size === 0) return { file: null, error: null }; if (value.type !== "application/pdf") return { file: null, error: "Choose a PDF résumé." }; if (value.size > MAX_PROFILE_ASSET_SIZE) return { file: null, error: "Résumé must be 5 MB or smaller." }; return { file: value, error: null }; }
export async function uploadProfileAsset(supabase: SupabaseClient, path: string, file: File) { const { error } = await supabase.storage.from(PORTFOLIO_ASSETS_BUCKET).upload(path, file, { contentType: file.type, upsert: true, cacheControl: "3600" }); if (error) return { publicUrl: null, error }; const { data } = supabase.storage.from(PORTFOLIO_ASSETS_BUCKET).getPublicUrl(path); return { publicUrl: `${data.publicUrl}?v=${Date.now()}`, error: null }; }
export async function removeProfileAsset(supabase: SupabaseClient, path: string) { const { error } = await supabase.storage.from(PORTFOLIO_ASSETS_BUCKET).remove([path]); return { error }; }
