"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { staggerContainer, slideUp } from "@/components/animations/variants"

export function HeroCTAGroup() {
  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={slideUp}>
        <MagneticButton strength={0.2} radius={80}>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-10 text-sm font-medium tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Shop Now
          </Link>
        </MagneticButton>
      </motion.div>
      <motion.div variants={slideUp}>
        <MagneticButton strength={0.2} radius={80}>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-10 text-sm font-medium tracking-wider uppercase border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Explore Collection
          </Link>
        </MagneticButton>
      </motion.div>
    </motion.div>
  )
}
