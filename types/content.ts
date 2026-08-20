export const SKILL_CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Security & Integration"] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export type Skill = { id: string; name: string; category: string; proficiency: number | null; icon: string | null; display_order: number; is_visible: boolean; created_at: string; updated_at: string };
export type Experience = { id: string; company: string; position: string; location: string | null; employment_type: string | null; start_date: string; end_date: string | null; is_current: boolean; summary: string | null; achievements: string[]; technologies: string[]; company_url: string | null; display_order: number; is_visible: boolean; created_at: string; updated_at: string };
export type ContentFormState = { errors: Record<string, string[] | undefined>; formError: string | null; success?: string | null };
export const initialContentFormState: ContentFormState = { errors: {}, formError: null, success: null };
