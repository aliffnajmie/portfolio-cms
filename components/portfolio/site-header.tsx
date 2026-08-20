import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSiteProfile } from "@/lib/profile-public";

export function BrandMark({ cms = false, name }: { cms?: boolean; name?: string }) {
  const initials = name ? name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() : "P";
  return <span className="inline-flex items-center gap-3 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-md border border-primary/25 bg-primary/10 text-xs text-primary">{cms ? "CMS" : initials}</span><span>{cms ? "Portfolio CMS" : name ?? "Portfolio"}</span></span>;
}

export async function SiteHeader() {
  const { profile } = await getSiteProfile();
  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl"><nav className="page-shell flex h-[4.5rem] items-center justify-between" aria-label="Main navigation"><Link href="/" aria-label={`${profile?.full_name ?? "Portfolio"} home`}><BrandMark name={profile?.full_name}/></Link><div className="flex items-center gap-1 sm:gap-2"><Button variant="ghost" size="sm" asChild><Link href="/projects">Projects</Link></Button><Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex"><Link href="/#skills">Expertise</Link></Button><Button variant="outline" size="sm" asChild><Link href="/#contact">Let&apos;s talk <ArrowUpRight/></Link></Button></div></nav></header>;
}
