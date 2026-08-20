import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() { return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-5xl"><Skeleton className="h-10 w-72"/><Skeleton className="mt-4 h-5 max-w-xl"/><div className="mt-10 space-y-6"><Skeleton className="h-80"/><Skeleton className="h-72"/><Skeleton className="h-64"/></div></div></main>; }
