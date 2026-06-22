"use client"

import { useState, useMemo } from "react"
import { Search, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "./data-table-pagination"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  itemsPerPage?: number
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  selection?: {
    selected: Set<string>
    onSelectionChange: (selected: Set<string>) => void
    getId: (row: T) => string
  }
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  itemsPerPage = 20,
  loading = false,
  emptyMessage = "No data found",
  onRowClick,
  selection,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = useMemo(() => {
    let filtered = [...data]
    if (search) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = row[col.key]
          return value?.toString().toLowerCase().includes(search.toLowerCase())
        }),
      )
    }
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] as string | number
        const bVal = b[sortConfig.key] as string | number
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
    return filtered
  }, [data, search, sortConfig, columns])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" }
      }
      return { key, direction: "asc" }
    })
  }

  const toggleAll = () => {
    if (!selection) return
    if (selection.selected.size === paginatedData.length) {
      selection.onSelectionChange(new Set())
    } else {
      selection.onSelectionChange(new Set(paginatedData.map((row) => selection.getId(row))))
    }
  }

  const toggleOne = (id: string) => {
    if (!selection) return
    const next = new Set(selection.selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    selection.onSelectionChange(next)
  }

  if (loading) {
    return (
      <div className="border border-border">
        <div className="animate-pulse p-4 space-y-4">
          {searchable && <div className="h-10 bg-muted" />}
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted/50" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-border">
      {searchable && (
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="pl-10"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {selection && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selection.selected.size === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider",
                    col.sortable && "cursor-pointer hover:text-foreground select-none",
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortConfig?.key === col.key && (
                      <span className="inline-flex flex-col">
                        <ChevronUp className={cn("h-3 w-3", sortConfig.direction === "asc" ? "text-foreground" : "text-muted-foreground/40")} />
                        <ChevronDown className={cn("h-3 w-3 -mt-1", sortConfig.direction === "desc" ? "text-foreground" : "text-muted-foreground/40")} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selection ? 1 : 0)} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-border transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selection && (
                    <td className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selection.selected.has(selection.getId(row))}
                        onChange={() => toggleOne(selection.getId(row))}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={filteredData.length}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
