"use client"

import { useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  radius = 100,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance < radius) {
      const force = (1 - distance / radius) * strength
      x.set(deltaX * force)
      y.set(deltaY * force)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
