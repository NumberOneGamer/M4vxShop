"use client"

import Image from "next/image"
import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Play } from "lucide-react"

interface ThumbnailItem {
  type: "image" | "video"
  url: string
  alt: string | null
}

interface ProductThumbnailsProps {
  items: ThumbnailItem[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function ProductThumbnails({ items, activeIndex, onSelect }: ProductThumbnailsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRef.current) return
    const child = scrollRef.current.children[activeIndex] as HTMLElement | undefined
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
    }
  }, [activeIndex])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-none pb-1"
    >
      {items.map((item, index) => (
        <button
          key={`${item.url}-${index}`}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20",
            "border-2 overflow-hidden bg-secondary",
            "transition-all duration-200",
            index === activeIndex
              ? "border-foreground"
              : "border-border hover:border-muted-foreground/50"
          )}
          aria-label={`View ${item.type} ${index + 1}`}
          aria-current={index === activeIndex ? "true" : undefined}
        >
          <Image
            src={item.url}
            alt={item.alt ?? `Thumbnail ${index + 1}`}
            fill
            className="object-cover"
            sizes="80px"
          />
          {item.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="w-4 h-4 text-white" fill="white" />
            </div>
          )}
          {index === activeIndex && (
            <motion.div
              layoutId="thumbnail-indicator"
              className="absolute inset-0 border-2 border-foreground pointer-events-none"
              transition={{ duration: 0.2 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
