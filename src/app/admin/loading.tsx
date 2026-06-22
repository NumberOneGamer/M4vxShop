import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="p-6 md:p-8 pt-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="rounded-sm border border-border">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-4 w-64" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-border flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
