"use server";

import { contactSchema } from "@/lib/contact-schema";
import { createClient } from "@/lib/supabase/server";
import { emptyContactValues, type ContactFormState, type ContactFormValues } from "@/types/contact";

const allowedFields = new Set(["name", "email", "subject", "message", "website", "started_at"]);
const genericError = "Your message couldn't be sent. Please review the form and try again.";

export async function submitContactMessage(_state: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const values: ContactFormValues = { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? ""), subject: String(formData.get("subject") ?? ""), message: String(formData.get("message") ?? "") };
  const unexpected = Array.from(formData.keys()).some((key) => !key.startsWith("$ACTION_") && !allowedFields.has(key));
  const honeypot = String(formData.get("website") ?? "").trim();
  const startedAt = Number(formData.get("started_at"));
  const elapsed = Date.now() - startedAt;
  if (unexpected || honeypot || !Number.isFinite(startedAt) || elapsed < 3000 || elapsed > 2 * 60 * 60 * 1000) return { status: "error", errors: {}, formError: genericError, values };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) return { status: "error", errors: parsed.error.flatten().fieldErrors, formError: null, values };
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ ...parsed.data, status: "new", admin_notes: null });
  if (error) { console.error("Failed to submit contact message", { code: error.code }); return { status: "error", errors: {}, formError: genericError, values }; }
  return { status: "success", errors: {}, formError: null, values: emptyContactValues };
}
