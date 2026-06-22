"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductThumbnails } from "./product-thumbnails"
import type { ProductDetailImage } from "@/types/product"

const ZoomOverlay = dynamic(() => import("./zoom-overlay").then((m) => m.ZoomOverlay), {
  ssr: false,
})

interface ProductGalleryProps {
  images: ProductDetailImage[]
  videos?: { url: string; thumbnail: string | null }[]
}

export function ProductGallery({ images, videos = [] }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showThumbnails, setShowThumbnails] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useRef(false)

  if (typeof window !== "undefined") {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  }

  const allMedia = [
    ...images.map((img) => ({ type: "image" as const, url: img.url, alt: img.alt })),
    ...videos.map((vid) => ({ type: "video" as const, url: vid.url, alt: null, thumbnail: vid.thumbnail })),
  ]

  const current = allMedia[activeIndex] ?? allMedia[0]

  const handlePrevious = useCallback(() => {
    setActiveIndex((i) => (i > 0 ? i - 1 : allMedia.length - 1))
    setIsZoomed(false)
  }, [allMedia.length])

  const handleNext = useCallback(() => {
    setActiveIndex((i) => (i < allMedia.length - 1 ? i + 1 : 0))
    setIsZoomed(false)
  }, [allMedia.length])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current || !isZoomed) return
      const rect = imageRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePos({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) })
    },
    [isZoomed]
  )

  if (allMedia.length === 0) {
    return (
      <div className="aspect-square bg-secondary flex items-center justify-center border border-border">
        <span className="text-muted-foreground text-sm">No images available</span>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <div className="relative overflow-hidden border border-border bg-secondary">
          <div
            ref={imageRef}
            className="aspect-square relative cursor-crosshair"
            onMouseEnter={() => setShowThumbnails(true)}
            onMouseLeave={() => setShowThumbnails(false)}
            onMouseMove={handleMouseMove}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={prefersReducedMotion.current ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion.current ? {} : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                {current.type === "video" ? (
                  <video
                    src={current.url}
                    poster={current.thumbnail ?? undefined}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={current.url}
                    alt={current.alt ?? "Product image"}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={
                      isZoomed
                        ? {
                            transform: "scale(1.5)",
                            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                            transition: "transform 0.1s ease-out",
                          }
                        : undefined
                    }
                    onClick={() => setIsZoomed(!isZoomed)}
                    priority
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {allMedia.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2",
                    "w-10 h-10 flex items-center justify-center",
                    "bg-background/80 backdrop-blur-sm border border-border",
                    "hover:bg-background transition-colors z-10",
                    "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                    showThumbnails ? "opacity-100" : "md:opacity-0"
                  )}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2",
                    "w-10 h-10 flex items-center justify-center",
                    "bg-background/80 backdrop-blur-sm border border-border",
                    "hover:bg-background transition-colors z-10",
                    "opacity-100 md:opacity-0 md:group-hover:opacity-100",
                    showThumbnails ? "opacity-100" : "md:opacity-0"
                  )}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {current.type === "image" && (
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className={cn(
                  "absolute bottom-3 right-3",
                  "w-9 h-9 flex items-center justify-center",
                  "bg-background/80 backdrop-blur-sm border border-border",
                  "hover:bg-background transition-colors z-10"
                )}
                aria-label="Toggle zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {allMedia.length > 1 && (
          <ProductThumbnails
            items={allMedia}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        )}
      </div>

      <AnimatePresence>
        {isZoomed && current.type === "image" && (
          <ZoomOverlay
            src={current.url}
            alt={current.alt ?? "Product image"}
            onClose={() => setIsZoomed(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
