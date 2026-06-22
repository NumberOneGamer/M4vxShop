"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { slideInLeft } from "./variants"
interface SlideInLeftProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

export function SlideInLeft({
  children,
  className,
  delay = 0,
  duration = 0.6,
  once = true,
}: SlideInLeftProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={slideInLeft}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
