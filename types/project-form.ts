export type ProjectFormField =
  | "title"
  | "slug"
  | "summary"
  | "content"
  | "technologies"
  | "github_url"
  | "live_url"
  | "thumbnail_url"
  | "status"
  | "featured"
  | "display_order";

export type ProjectFormState = {
  errors: Partial<Record<ProjectFormField, string[]>>;
  formError: string | null;
};

export const initialProjectFormState: ProjectFormState = {
  errors: {},
  formError: null,
};
