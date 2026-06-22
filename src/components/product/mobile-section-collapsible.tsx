"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileSectionCollapsibleProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export function MobileSectionCollapsible({
  title,
  icon,
  children,
  defaultOpen = false,
}: MobileSectionCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="border-t border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 md:py-0 md:cursor-default gap-2"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h2 className="text-base md:text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform md:hidden",
            open && "rotate-180"
          )}
          strokeWidth={1.5}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[5000px] pb-6 md:pb-0" : "max-h-0 md:max-h-none md:overflow-visible pb-0"
        )}
      >
        {children}
      </div>
    </section>
  )
}
