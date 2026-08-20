import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() { return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-6xl"><Skeleton className="h-10 w-48"/><div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton className="h-48" key={index}/>)}</div></div></main>; }
