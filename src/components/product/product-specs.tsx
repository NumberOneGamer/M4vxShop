"use client"

import { Ruler } from "lucide-react"
import { MobileSectionCollapsible } from "./mobile-section-collapsible"

export interface SpecItem {
  label: string
  value: string
}

interface ProductSpecsProps {
  specs: SpecItem[]
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  if (specs.length === 0) return null

  return (
    <MobileSectionCollapsible
      title="Specifications"
      icon={<Ruler className="w-4 h-4" strokeWidth={1.5} />}
    >
      <div className="border border-border divide-y divide-border">
        {specs.map((spec, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center py-3 px-4 text-sm"
          >
            <span className="text-muted-foreground sm:w-1/3 font-medium">
              {spec.label}
            </span>
            <span className="sm:w-2/3">{spec.value}</span>
          </div>
        ))}
      </div>
    </MobileSectionCollapsible>
  )
}
