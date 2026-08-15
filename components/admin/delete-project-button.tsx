"use client";

import { useActionState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { initialDeleteProjectState, type DeleteProjectState } from "@/types/project-form";

type DeleteAction = (state: DeleteProjectState, formData: FormData) => Promise<DeleteProjectState>;

export function DeleteProjectButton({ action, title }: { action: DeleteAction; title: string }) {
  const [state, formAction, pending] = useActionState(action, initialDeleteProjectState);

  return <div><form action={formAction} onSubmit={(event) => {
    if (!window.confirm(`Delete “${title}”? This action cannot be undone.`)) event.preventDefault();
  }}><button type="submit" disabled={pending} className="inline-flex h-11 items-center justify-center gap-2 border border-red-400/25 px-4 text-sm font-medium text-red-300 transition hover:bg-red-400/[0.06] disabled:cursor-not-allowed disabled:opacity-60">{pending ? <><LoaderCircle className="animate-spin" size={16}/>Deleting...</> : <><Trash2 size={16}/>Delete project</>}</button></form>{state?.error && <p role="alert" className="mt-3 text-sm text-red-300">{state.error}</p>}</div>;
}
