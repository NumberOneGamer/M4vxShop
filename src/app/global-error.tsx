"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-dvh items-center justify-center bg-white px-4">
          <div className="flex flex-col items-center text-center max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              Critical error
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              A critical error occurred. Please refresh the page.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium bg-black text-white"
            >
              Refresh
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
