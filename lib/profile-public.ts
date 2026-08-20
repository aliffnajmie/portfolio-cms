import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SiteProfile } from "@/types/profile";
const columns = "id, full_name, professional_title, short_bio, about_bio, location, email, phone, availability_status, availability_message, profile_image_url, resume_url, github_url, linkedin_url, website_url, created_at, updated_at";
export const getSiteProfile = cache(async (): Promise<{ profile: SiteProfile | null; error: boolean }> => { const supabase = await createClient(); const { data, error } = await supabase.from("site_profile").select(columns).maybeSingle(); if (error) { console.error("Failed to load site profile", { code: error.code, message: error.message }); return { profile: null, error: true }; } return { profile: data as SiteProfile | null, error: false }; });
export { columns as siteProfileColumns };
