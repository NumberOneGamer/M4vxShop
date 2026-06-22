"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollTriggerProps {
  children: ReactNode
  className?: string
  once?: boolean
}

export function ScrollTrigger({
  children,
  className,
  once = true,
}: ScrollTriggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
