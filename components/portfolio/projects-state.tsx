import { AlertCircle, FolderKanban } from "lucide-react";

export function ProjectsState({ variant = "empty", featured = false }: { variant?: "empty" | "error"; featured?: boolean }) {
  const isError = variant === "error";
  return <div className={`flex min-h-64 flex-col items-center justify-center border px-6 text-center ${isError ? "border-red-400/15 bg-red-400/[0.025]" : "border-dashed border-white/15 bg-slate-950/25"}`}><div className={`grid size-12 place-items-center border ${isError ? "border-red-400/20 bg-red-400/[0.04] text-red-300" : "border-cyan-300/20 bg-cyan-300/[0.04] text-cyan-300"}`}>{isError ? <AlertCircle size={22}/> : <FolderKanban size={22}/>}</div><h3 className="mt-6 text-xl font-semibold text-white">{isError ? "Projects are temporarily unavailable" : featured ? "Featured work is coming soon" : "No published projects yet"}</h3><p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{isError ? "Please refresh the page or try again shortly." : featured ? "New case studies are being prepared. Explore the full project archive in the meantime." : "Published work will appear here as soon as it is ready."}</p></div>;
}
