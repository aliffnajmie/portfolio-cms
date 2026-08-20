"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <main className="grid min-h-svh place-items-center px-5"><div className="max-w-md text-center"><AlertTriangle className="mx-auto text-primary"/><h1 className="mt-6 text-3xl font-semibold">Something went wrong.</h1><p className="mt-3 text-muted-foreground">The page couldn&apos;t be loaded. Try again to continue.</p><Button className="mt-7" onClick={reset}>Try again</Button></div></main>; }
