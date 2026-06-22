import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutSuccessLoading() {
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        <Skeleton className="h-14 w-14 mb-6" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
