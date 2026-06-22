"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"

interface SlideUpProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
}

export function SlideUp({
  children,
  className,
  delay = 0,
  duration = 0.7,
  distance = 40,
  once = true,
}: SlideUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
