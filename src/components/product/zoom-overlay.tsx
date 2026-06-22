"use client"

import { useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface ZoomOverlayProps {
  src: string
  alt: string
  onClose: () => void
}

export function ZoomOverlay({ src, alt, onClose }: ZoomOverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label="Image zoom overlay"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors rounded-full"
        aria-label="Close zoom"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <motion.img
        key={src}
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  )
}
