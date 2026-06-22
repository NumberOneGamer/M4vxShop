import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  )
}
