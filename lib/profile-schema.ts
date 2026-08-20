import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`).transform((value) => value || null);
const optionalUrl = z.string().trim().refine((value) => value === "" || (URL.canParse(value) && ["http:", "https:"].includes(new URL(value).protocol)), "Enter a valid HTTP or HTTPS URL.").transform((value) => value || null);
export const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required.").max(120),
  professional_title: z.string().trim().min(1, "Professional title is required.").max(160),
  short_bio: z.string().trim().min(1, "Short introduction is required.").max(500),
  about_bio: optionalText(5000), location: optionalText(160),
  email: z.string().trim().refine((value) => value === "" || z.email().safeParse(value).success, "Enter a valid email address.").transform((value) => value || null),
  phone: optionalText(40), availability_status: optionalText(80), availability_message: optionalText(300),
  github_url: optionalUrl, linkedin_url: optionalUrl, website_url: optionalUrl,
});
export const profileFields = ["full_name", "professional_title", "short_bio", "about_bio", "location", "email", "phone", "availability_status", "availability_message", "github_url", "linkedin_url", "website_url"] as const;
export function profileFormData(formData: FormData) { return Object.fromEntries(profileFields.map((field) => [field, formData.get(field) ?? ""])); }
