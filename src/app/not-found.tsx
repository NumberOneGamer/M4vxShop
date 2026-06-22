import Link from "next/link"
import { Frown } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="mb-6 flex h-14 w-14 items-center justify-center border border-border">
          <Frown className="h-6 w-6 text-foreground" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium bg-black text-white hover:bg-black/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
