"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  once?: boolean
}

export function TextReveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  as: Tag = "p",
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-100px" })
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  const words = children.split(" ")

  return (
    <div ref={ref} className={"overflow-hidden" + (className ? ` ${className}` : "")}>
      <Tag className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "100%", opacity: 0 }}
              animate={
                isInView
                  ? { y: 0, opacity: 1 }
                  : { y: "100%", opacity: 0 }
              }
              transition={{
                duration,
                delay: delay + i * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {word}
              {i < words.length - 1 && "\u00A0"}
            </motion.span>
          </span>
        ))}
      </Tag>
    </div>
  )
}
