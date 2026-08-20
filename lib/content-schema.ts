import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`).transform((value) => value || null);
const optionalUrl = z.string().trim().refine((value) => value === "" || URL.canParse(value), "Enter a valid URL, including https://.").transform((value) => value || null);
const idSchema = z.string().uuid("Invalid record identifier.");

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100), category: z.string().trim().min(1, "Category is required.").max(80),
  proficiency: z.string().trim().transform((value) => value === "" ? null : Number(value)).refine((value) => value === null || (Number.isInteger(value) && value >= 1 && value <= 100), "Use a whole number from 1 to 100."),
  icon: optionalText(80), display_order: z.coerce.number().int("Display order must be a whole number."), is_visible: z.string().optional().transform((value) => value === "on"),
});

const listFromLines = z.string().transform((value) => Array.from(new Set(value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))));
const listFromCommas = z.string().transform((value) => Array.from(new Set(value.split(",").map((item) => item.trim()).filter(Boolean))));
export const experienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required.").max(120), position: z.string().trim().min(1, "Position is required.").max(120),
  location: optionalText(120), employment_type: optionalText(80), start_date: z.iso.date("Choose a valid start date."), end_date: z.string().trim(),
  is_current: z.string().optional().transform((value) => value === "on"), summary: optionalText(2000), achievements: listFromLines, technologies: listFromCommas,
  company_url: optionalUrl, display_order: z.coerce.number().int("Display order must be a whole number."), is_visible: z.string().optional().transform((value) => value === "on"),
}).superRefine((value, ctx) => { if (!value.is_current && value.end_date && !/^\d{4}-\d{2}-\d{2}$/.test(value.end_date)) ctx.addIssue({ code: "custom", path: ["end_date"], message: "Choose a valid end date." }); if (!value.is_current && value.end_date && value.end_date < value.start_date) ctx.addIssue({ code: "custom", path: ["end_date"], message: "End date cannot be before the start date." }); }).transform((value) => ({ ...value, end_date: value.is_current || !value.end_date ? null : value.end_date }));

export function values(formData: FormData, fields: string[]) { return Object.fromEntries(fields.map((field) => [field, formData.get(field) ?? ""])); }
export { idSchema };
