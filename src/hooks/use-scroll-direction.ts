"use client"

import { useEffect, useRef, useState } from "react"

export type ScrollDirection = "up" | "down"

export function useScrollDirection(threshold = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("down")
  const prevScrollY = useRef(0)

  useEffect(() => {
    let ticking = false

    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const delta = currentScrollY - prevScrollY.current

          if (Math.abs(delta) > threshold) {
            setDirection(delta > 0 ? "down" : "up")
          }

          prevScrollY.current = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [threshold])

  return direction
}
