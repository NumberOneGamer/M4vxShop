"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="mb-6 flex h-14 w-14 items-center justify-center border border-border">
          <AlertTriangle className="h-6 w-6 text-foreground" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium bg-black text-white hover:bg-black/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
