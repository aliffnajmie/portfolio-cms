import { z } from "zod";
import { CONTACT_STATUSES } from "@/types/contact";

export const contactSchema = z.strictObject({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100, "Name must be 100 characters or fewer."),
  email: z.string().trim().max(254).pipe(z.email("Enter a valid email address.")),
  subject: z.string().trim().max(150, "Subject must be 150 characters or fewer.").transform((value) => value || null),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(3000, "Message must be 3000 characters or fewer."),
});
export const messageIdSchema = z.string().uuid("Invalid message identifier.");
export const messageAdminSchema = z.object({ status: z.enum(CONTACT_STATUSES), admin_notes: z.string().trim().max(5000, "Notes must be 5000 characters or fewer.").transform((value) => value || null) });
