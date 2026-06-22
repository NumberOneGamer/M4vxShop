"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, animate } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

interface CounterProps {
  from?: number
  to: number
  suffix?: string
  prefix?: string
  label?: string
  className?: string
  duration?: number
  once?: boolean
}

export function Counter({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  label,
  className,
  duration = 1.5,
  once = true,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: "-50px" })
  const prefersReducedMotion = usePrefersReducedMotion()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!isInView || hasAnimated) return

    if (prefersReducedMotion) {
      setHasAnimated(true)
      return
    }

    const controls = animate(from, to, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate(value) {
        if (nodeRef.current) {
          nodeRef.current.textContent = Math.round(value).toLocaleString()
        }
      },
      onComplete() {
        setHasAnimated(true)
      },
    })

    return () => controls.stop()
  }, [from, to, duration, isInView, hasAnimated, prefersReducedMotion])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className={cn("text-center", className)}
    >
      <div className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tighter leading-none">
        {prefix}
        <span ref={nodeRef}>
          {hasAnimated || prefersReducedMotion
            ? to.toLocaleString()
            : from.toLocaleString()}
        </span>
        {suffix}
      </div>
      {label && (
        <div className="mt-2 text-sm text-muted-foreground">{label}</div>
      )}
    </motion.div>
  )
}
