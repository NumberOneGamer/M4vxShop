"use client"

import { useEffect, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"

interface HeroMouseParallaxProps {
  children: ReactNode
  className?: string
  factor?: number
}

export function HeroMouseParallax({
  children,
  className,
  factor = 0.04,
}: HeroMouseParallaxProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      offsetX.set((e.clientX - cx) * factor)
      offsetY.set((e.clientY - cy) * factor)
    }
    window.addEventListener("mousemove", handler, { passive: true })
    return () => window.removeEventListener("mousemove", handler)
  }, [factor, offsetX, offsetY])

  const springX = useSpring(offsetX, { stiffness: 80, damping: 30 })
  const springY = useSpring(offsetY, { stiffness: 80, damping: 30 })

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      style={{
        x: springX,
        y: springY,
      }}
    >
      {children}
    </motion.div>
  )
}
