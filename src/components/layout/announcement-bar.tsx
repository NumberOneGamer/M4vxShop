"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
const ANNOUNCEMENTS = [
  "Free shipping on orders over $100",
  "New collection: Summer Essentials — Shop Now",
  "Sign up & get 10% off your first order",
]

const STORAGE_KEY = "m4vx-announcement-dismissed"

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) setDismissed(false)
  }, [])

  useEffect(() => {
    if (dismissed) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  if (dismissed) return null

  return (
    <div className="relative h-9 bg-black text-white text-xs flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center px-8"
        >
          {ANNOUNCEMENTS[currentIndex]}
        </motion.p>
      </AnimatePresence>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
