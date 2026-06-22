import { SearchX } from "lucide-react"

interface EmptySearchResultsProps {
  search?: string
}

export function EmptySearchResults({ search }: EmptySearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <SearchX className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-1">No products found</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {search
          ? `No results for "${search}". Try a different search term or adjust your filters.`
          : "Try adjusting your filters to find what you're looking for."}
      </p>
    </div>
  )
}
