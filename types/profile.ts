export type SiteProfile = {
  id: string; full_name: string; professional_title: string; short_bio: string; about_bio: string | null;
  location: string | null; email: string | null; phone: string | null; availability_status: string | null;
  availability_message: string | null; profile_image_url: string | null; resume_url: string | null;
  github_url: string | null; linkedin_url: string | null; website_url: string | null;
  created_at: string; updated_at: string;
};

export type ProfileFormValues = { full_name: string; professional_title: string; short_bio: string; about_bio: string; location: string; email: string; phone: string; availability_status: string; availability_message: string; profile_image_url: string; resume_url: string; github_url: string; linkedin_url: string; website_url: string };
export type ProfileFormState = { errors: Partial<Record<keyof ProfileFormValues | "profile_image" | "resume_file", string[]>>; formError: string | null };
export const initialProfileFormState: ProfileFormState = { errors: {}, formError: null };
export const emptyProfileValues: ProfileFormValues = { full_name: "", professional_title: "", short_bio: "", about_bio: "", location: "", email: "", phone: "", availability_status: "", availability_message: "", profile_image_url: "", resume_url: "", github_url: "", linkedin_url: "", website_url: "" };
export function profileToFormValues(profile: SiteProfile | null): ProfileFormValues { if (!profile) return emptyProfileValues; return { full_name: profile.full_name, professional_title: profile.professional_title, short_bio: profile.short_bio, about_bio: profile.about_bio ?? "", location: profile.location ?? "", email: profile.email ?? "", phone: profile.phone ?? "", availability_status: profile.availability_status ?? "", availability_message: profile.availability_message ?? "", profile_image_url: profile.profile_image_url ?? "", resume_url: profile.resume_url ?? "", github_url: profile.github_url ?? "", linkedin_url: profile.linkedin_url ?? "", website_url: profile.website_url ?? "" }; }
