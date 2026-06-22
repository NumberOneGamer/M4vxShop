"use client"

import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
}

export function InfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  loading,
}: InfiniteScrollTriggerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || loading) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  if (!hasMore) return null

  return (
    <div ref={ref} className="flex justify-center py-8">
      {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
    </div>
  )
}
