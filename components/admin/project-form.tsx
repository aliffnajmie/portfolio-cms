"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { normalizeSlug } from "@/lib/projects";
import { emptyProjectFormValues, initialProjectFormState, type ProjectFormState, type ProjectFormValues } from "@/types/project-form";

type FieldProps = { name: string; label: string; error?: string[]; required?: boolean; hint?: string; children: React.ReactNode };

function Field({ name, label, error, required, hint, children }: FieldProps) {
  const describedBy = [hint ? `${name}-hint` : "", error?.length ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;
  return <div><label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-200">{label}{required && <span className="ml-1 text-cyan-300" aria-hidden="true">*</span>}</label>{hint && <p id={`${name}-hint`} className="mb-2 text-xs text-slate-500">{hint}</p>}<div data-describedby={describedBy}>{children}</div>{error?.[0] && <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-red-300">{error[0]}</p>}</div>;
}

const inputClass = "h-12 w-full border border-white/15 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-1 focus:ring-cyan-300/30 disabled:opacity-60";
const allowedThumbnailTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxThumbnailSize = 5 * 1024 * 1024;

type ProjectFormAction = (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;

export function ProjectForm({ action, initialValues = emptyProjectFormValues, mode = "create" }: { action: ProjectFormAction; initialValues?: ProjectFormValues; mode?: "create" | "edit" }) {
  const [state, formAction, pending] = useActionState(action, initialProjectFormState);
  const [slug, setSlug] = useState(initialValues.slug);
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [thumbnailPreview, setThumbnailPreview] = useState(initialValues.thumbnail_url);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  const [thumbnailClientError, setThumbnailClientError] = useState<string | null>(null);
  const thumbnailInput = useRef<HTMLInputElement>(null);
  const errors = state?.errors ?? {};
  const formError = state?.formError ?? null;

  useEffect(() => {
    return () => {
      if (thumbnailPreview.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  function handleThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setThumbnailPreview(removeThumbnail ? "" : initialValues.thumbnail_url);
      return;
    }

    let validationError: string | null = null;
    if (!allowedThumbnailTypes.has(file.type)) validationError = "Choose a JPEG, PNG, or WebP image.";
    else if (file.size > maxThumbnailSize) validationError = "Image must be 5 MB or smaller.";

    if (validationError) {
      event.target.value = "";
      setThumbnailPreview("");
      setThumbnailClientError(validationError);
      return;
    }

    setThumbnailClientError(null);
    setRemoveThumbnail(false);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function handleRemoveThumbnail(checked: boolean) {
    setRemoveThumbnail(checked);
    setThumbnailClientError(null);
    if (checked && thumbnailInput.current) thumbnailInput.current.value = "";
    setThumbnailPreview(checked ? "" : initialValues.thumbnail_url);
  }

  const thumbnailErrors = thumbnailClientError ? [thumbnailClientError] : errors.thumbnail_image;

  return <form action={formAction} className="space-y-8" noValidate onSubmit={(event) => { if (thumbnailClientError) event.preventDefault(); }}>
    {formError && <div role="alert" className="border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-200">{formError}</div>}
    <section className="border border-white/10 bg-slate-950/25 p-5 sm:p-7"><div className="mb-7"><h2 className="text-lg font-semibold text-white">Project details</h2><p className="mt-1 text-sm text-slate-500">The core information used to identify and describe this project.</p></div><div className="grid gap-6 sm:grid-cols-2">
      <Field name="title" label="Title" required error={errors.title}><input id="title" name="title" className={inputClass} defaultValue={initialValues.title} required maxLength={120} disabled={pending} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : undefined} onChange={(event) => { if (!slugEdited) setSlug(normalizeSlug(event.target.value)); }}/></Field>
      <Field name="slug" label="Slug" required hint="Used in the project's public URL." error={errors.slug}><input id="slug" name="slug" className={inputClass} required maxLength={120} value={slug} disabled={pending} aria-invalid={Boolean(errors.slug)} aria-describedby={errors.slug ? "slug-error slug-hint" : "slug-hint"} onChange={(event) => { setSlugEdited(true); setSlug(event.target.value); }} onBlur={() => setSlug(normalizeSlug(slug))}/></Field>
      <div className="sm:col-span-2"><Field name="summary" label="Summary" required error={errors.summary}><textarea id="summary" name="summary" rows={3} className={`${inputClass} h-auto min-h-28 py-3`} defaultValue={initialValues.summary} required maxLength={500} disabled={pending} aria-invalid={Boolean(errors.summary)} aria-describedby={errors.summary ? "summary-error" : undefined}/></Field></div>
      <div className="sm:col-span-2"><Field name="content" label="Content" hint="Optional longer project description." error={errors.content}><textarea id="content" name="content" rows={8} className={`${inputClass} h-auto py-3`} defaultValue={initialValues.content} disabled={pending}/></Field></div>
      <div className="sm:col-span-2"><Field name="technologies" label="Technologies" hint="Separate technologies with commas." error={errors.technologies}><input id="technologies" name="technologies" className={inputClass} defaultValue={initialValues.technologies} placeholder="Next.js, TypeScript, Supabase" disabled={pending}/></Field></div>
    </div></section>
    <section className="border border-white/10 bg-slate-950/25 p-5 sm:p-7"><div className="mb-7"><h2 className="text-lg font-semibold text-white">Links and media</h2><p className="mt-1 text-sm text-slate-500">Optional destinations and a project thumbnail.</p></div><div className="grid gap-6 sm:grid-cols-2">
      <Field name="github_url" label="GitHub URL" error={errors.github_url}><input id="github_url" name="github_url" type="url" className={inputClass} defaultValue={initialValues.github_url} placeholder="https://github.com/..." disabled={pending} aria-invalid={Boolean(errors.github_url)} aria-describedby={errors.github_url ? "github_url-error" : undefined}/></Field>
      <Field name="live_url" label="Live URL" error={errors.live_url}><input id="live_url" name="live_url" type="url" className={inputClass} defaultValue={initialValues.live_url} placeholder="https://example.com" disabled={pending} aria-invalid={Boolean(errors.live_url)} aria-describedby={errors.live_url ? "live_url-error" : undefined}/></Field>
      <div className="sm:col-span-2">
        <Field name="thumbnail_image" label="Project thumbnail" hint="JPEG, PNG or WebP. Maximum file size: 5 MB." error={thumbnailErrors}>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <input ref={thumbnailInput} id="thumbnail_image" name="thumbnail_image" type="file" accept="image/jpeg,image/png,image/webp" className={`${inputClass} h-auto cursor-pointer py-3 file:mr-4 file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-950`} disabled={pending} aria-invalid={Boolean(thumbnailErrors)} aria-describedby={thumbnailErrors ? "thumbnail_image-error thumbnail_image-hint" : "thumbnail_image-hint"} onChange={handleThumbnailChange}/>
              {initialValues.thumbnail_url && <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-slate-300"><input name="remove_thumbnail" type="checkbox" checked={removeThumbnail} onChange={(event) => handleRemoveThumbnail(event.target.checked)} disabled={pending} className="size-4 accent-cyan-300"/>Remove existing image</label>}
            </div>
            <div className="relative aspect-video overflow-hidden border border-white/10 bg-slate-900">
              {thumbnailPreview ? <Image src={thumbnailPreview} alt={`${initialValues.title || "Project"} thumbnail preview`} fill sizes="(min-width: 1024px) 18rem, 100vw" className="object-cover" unoptimized/> : <div className="flex h-full items-center justify-center px-4 text-center text-xs text-slate-500">No thumbnail selected</div>}
            </div>
          </div>
        </Field>
      </div>
    </div></section>
    <section className="border border-white/10 bg-slate-950/25 p-5 sm:p-7"><div className="mb-7"><h2 className="text-lg font-semibold text-white">Publishing</h2><p className="mt-1 text-sm text-slate-500">Control visibility and placement in the portfolio.</p></div><div className="grid gap-6 sm:grid-cols-2">
      <Field name="status" label="Status" required error={errors.status}><select id="status" name="status" defaultValue={initialValues.status} className={inputClass} required disabled={pending} aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? "status-error" : undefined}><option value="draft">Draft</option><option value="published">Published</option></select></Field>
      <Field name="display_order" label="Display order" required hint="Lower numbers appear first." error={errors.display_order}><input id="display_order" name="display_order" type="number" step="1" defaultValue={initialValues.display_order} className={inputClass} required disabled={pending} aria-invalid={Boolean(errors.display_order)} aria-describedby={errors.display_order ? "display_order-error display_order-hint" : "display_order-hint"}/></Field>
      <div className="sm:col-span-2"><label className="flex cursor-pointer items-start gap-3 border border-white/10 bg-white/[0.02] p-4"><input name="featured" type="checkbox" defaultChecked={initialValues.featured} className="mt-0.5 size-4 accent-cyan-300" disabled={pending}/><span><span className="block text-sm font-medium text-slate-200">Featured project</span><span className="mt-1 block text-xs text-slate-500">Highlight this project in featured areas of the portfolio.</span></span></label></div>
    </div></section>
    <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end"><Link href="/admin/projects" className="button-secondary justify-center">Cancel</Link><button type="submit" disabled={pending || Boolean(thumbnailClientError)} className="button-primary min-w-36 justify-center disabled:cursor-not-allowed disabled:opacity-60">{pending ? <><LoaderCircle className="animate-spin" size={17}/>{mode === "edit" ? "Saving..." : "Creating..."}</> : mode === "edit" ? "Save changes" : "Create project"}</button></div>
  </form>;
}
