import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrandMark({ cms = false }: { cms?: boolean }) {
  return <span className="inline-flex items-center gap-3 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-md border border-primary/25 bg-primary/10 text-xs text-primary">AN</span><span>{cms ? "Portfolio CMS" : "Aliff Najmie"}</span></span>;
}

export function SiteHeader() {
  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl"><nav className="page-shell flex h-[4.5rem] items-center justify-between" aria-label="Main navigation"><Link href="/" aria-label="Aliff Najmie home"><BrandMark/></Link><div className="flex items-center gap-1 sm:gap-2"><Button variant="ghost" size="sm" asChild><Link href="/projects">Projects</Link></Button><Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex"><Link href="/#skills">Expertise</Link></Button><Button variant="outline" size="sm" asChild><Link href="/#contact">Let&apos;s talk <ArrowUpRight/></Link></Button></div></nav></header>;
}
