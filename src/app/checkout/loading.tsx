import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutLoading() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
