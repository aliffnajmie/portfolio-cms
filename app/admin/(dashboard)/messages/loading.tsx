import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() { return <main className="p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-6xl"><Skeleton className="h-10 w-64"/><div className="mt-10 space-y-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton className="h-24" key={index}/>)}</div></div></main>; }
