"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterAccordionProps {
  title: string
  open?: boolean
  onToggle?: () => void
  children: React.ReactNode
}

export function FilterAccordion({
  title,
  open = true,
  onToggle,
  children,
}: FilterAccordionProps) {
  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-sm font-medium"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pt-1 space-y-2">{children}</div>
      </div>
    </div>
  )
}
