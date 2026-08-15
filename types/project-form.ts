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

export type ProjectFormValues = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  technologies: string;
  github_url: string;
  live_url: string;
  thumbnail_url: string;
  status: "draft" | "published";
  featured: boolean;
  display_order: number;
};

export const emptyProjectFormValues: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  technologies: "",
  github_url: "",
  live_url: "",
  thumbnail_url: "",
  status: "draft",
  featured: false,
  display_order: 0,
};

export const initialProjectFormState: ProjectFormState = {
  errors: {},
  formError: null,
};

export type DeleteProjectState = { error: string | null };

export const initialDeleteProjectState: DeleteProjectState = { error: null };
