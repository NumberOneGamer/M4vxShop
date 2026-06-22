"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { fadeIn } from "./variants"
interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  once = true,
}: FadeInProps) {
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
      variants={fadeIn}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
