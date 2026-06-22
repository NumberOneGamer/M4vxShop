"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0])
  const y = useTransform(scrollY, [0, 200], [0, 20])

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      style={{ opacity, y }}
    >
      <span className="text-xs tracking-widest uppercase text-muted-foreground">
        Scroll to explore
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </motion.div>
    </motion.div>
  )
}
