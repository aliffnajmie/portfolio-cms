"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { messageAdminSchema, messageIdSchema } from "@/lib/contact-schema";
import { createClient } from "@/lib/supabase/server";
import type { MessageActionState } from "@/types/contact";

async function adminClient() { const supabase = await createClient(); const { data: { user }, error } = await supabase.auth.getUser(); if (error || !user) redirect("/admin/login"); return { supabase, user }; }
export async function updateMessage(id: string, _state: MessageActionState, formData: FormData): Promise<MessageActionState> { const { supabase, user } = await adminClient(); const validId = messageIdSchema.safeParse(id); if (!validId.success) return { error: "This message couldn't be updated." }; const parsed = messageAdminSchema.safeParse({ status: formData.get("status"), admin_notes: formData.get("admin_notes") }); if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Review the message settings." }; const { data, error } = await supabase.from("contact_messages").update(parsed.data).eq("id", validId.data).select("id").maybeSingle(); if (error || !data) { console.error("Failed to update contact message", { code: error?.code, userId: user.id }); return { error: "The message couldn't be updated. Please try again." }; } revalidatePath("/admin/messages"); revalidatePath(`/admin/messages/${validId.data}`); redirect(`/admin/messages/${validId.data}?success=updated`); }
export async function deleteMessage(id: string, _state: MessageActionState): Promise<MessageActionState> { const { supabase, user } = await adminClient(); const validId = messageIdSchema.safeParse(id); if (!validId.success) return { error: "This message couldn't be deleted." }; const { data, error } = await supabase.from("contact_messages").delete().eq("id", validId.data).select("id").maybeSingle(); if (error || !data) { console.error("Failed to delete contact message", { code: error?.code, userId: user.id }); return { error: "The message couldn't be deleted." }; } revalidatePath("/admin/messages"); redirect("/admin/messages?success=deleted"); }
