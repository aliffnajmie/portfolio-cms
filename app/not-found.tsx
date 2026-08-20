import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="grid min-h-svh place-items-center px-5"><div className="max-w-lg text-center"><p className="eyebrow justify-center before:hidden">404 / Not found</p><h1 className="display-title">This page is off the map.</h1><p className="mt-5 text-muted-foreground">The page may have moved, or the project is no longer published.</p><Button className="mt-8" variant="outline" asChild><Link href="/"><ArrowLeft/>Back home</Link></Button></div></main>; }
