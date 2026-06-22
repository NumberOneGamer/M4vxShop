import { Skeleton } from "@/components/ui/skeleton"

export default function ShopPageLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6">
        <Skeleton className="h-8 w-20 mb-1" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-9 flex-1 max-w-sm" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
