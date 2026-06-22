"use client"

import { useEffect, useRef } from "react"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    previousRef.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const focusable = getFocusable()
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const timeout = setTimeout(() => {
      const focusable = getFocusable()
      if (focusable.length > 0) focusable[0].focus()
    }, 50)

    document.addEventListener("keydown", handler)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener("keydown", handler)
      previousRef.current?.focus()
    }
  }, [active])

  return containerRef
}
