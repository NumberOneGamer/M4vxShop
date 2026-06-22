"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"

interface ParallaxScrollProps {
  children: ReactNode
  className?: string
  speed?: number
}

export function ParallaxScroll({
  children,
  className,
  speed = 0.5,
}: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"] as const,
  })

  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [speed * 100, speed * -100]
  )

  return (
    <div ref={ref} className={"overflow-hidden" + (className ? ` ${className}` : "")}>
      <motion.div style={{ y: translateY }}>{children}</motion.div>
    </div>
  )
}
