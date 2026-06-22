import { Suspense } from "react"
import { getAllCategories } from "@/server/actions/category-actions"
import { CategoriesGridClient } from "./categories-grid-client"

async function CategoriesGridContent() {
  const categories = await getAllCategories()
  return <CategoriesGridClient categories={categories} />
}

function CategoriesGridFallback() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-3">
          <div className="h-3 w-20 bg-muted animate-pulse" />
          <div className="h-10 w-64 bg-muted animate-pulse" />
          <div className="h-5 w-80 bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2 lg:col-span-2 md:row-span-2 h-[300px] md:h-[416px] bg-muted animate-pulse" />
          <div className="h-[200px] bg-muted animate-pulse" />
          <div className="h-[200px] bg-muted animate-pulse" />
          <div className="h-[200px] bg-muted animate-pulse" />
          <div className="h-[200px] bg-muted animate-pulse" />
        </div>
      </div>
    </section>
  )
}

export function CategoriesGrid() {
  return (
    <Suspense fallback={<CategoriesGridFallback />}>
      <CategoriesGridContent />
    </Suspense>
  )
}
