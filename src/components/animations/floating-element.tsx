"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"

interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
  delay?: number
}

export function FloatingElement({
  children,
  className,
  amplitude = 10,
  duration = 4,
  delay = 0,
}: FloatingElementProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0, amplitude, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}
