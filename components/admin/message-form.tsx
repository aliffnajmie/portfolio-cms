"use client";
import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_STATUSES, initialMessageActionState, type ContactMessage, type MessageActionState } from "@/types/contact";
type Action = (state: MessageActionState, data: FormData) => Promise<MessageActionState>;
export function MessageForm({ message, action }: { message: ContactMessage; action: Action }) { const [state, formAction, pending] = useActionState(action, initialMessageActionState); return <form action={formAction} className="space-y-5">{state.error && <Alert variant="destructive">{state.error}</Alert>}<div className="space-y-2"><Label htmlFor="status">Status</Label><select id="status" name="status" defaultValue={message.status} className="h-11 w-full rounded-md border border-input bg-background/45 px-3.5 text-sm" disabled={pending}>{CONTACT_STATUSES.map((status) => <option value={status} key={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></div><div className="space-y-2"><Label htmlFor="admin_notes">Private admin notes</Label><Textarea id="admin_notes" name="admin_notes" rows={7} maxLength={5000} defaultValue={message.admin_notes ?? ""} disabled={pending}/><p className="text-xs text-muted-foreground">Notes are visible only in the authenticated CMS.</p></div><Button type="submit" disabled={pending}>{pending ? <><LoaderCircle className="animate-spin"/>Saving...</> : <><Save/>Save changes</>}</Button></form>; }
