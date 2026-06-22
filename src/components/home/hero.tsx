"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { letterReveal } from "@/components/animations/variants"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { HeroCTAGroup } from "./hero-cta-group"
import { HeroFloatingElements } from "./hero-floating-elements"
import { ScrollIndicator } from "./scroll-indicator"

function LetterRevealHeadline() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const text = "Designed For The Future"
  const letters = text.split("")
  if (prefersReducedMotion) {
    return <h1 className="font-heading font-extrabold leading-[0.95] tracking-tighter">{text}</h1>
  }

  return (
    <h1 className="font-heading font-extrabold leading-[0.95] tracking-tighter">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          custom={i}
          variants={letterReveal}
          initial="hidden"
          animate="visible"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </h1>
  )
}

interface HeroSubheadlineProps {
  children: ReactNode
  delay?: number
}

function HeroSubheadline({ children, delay = 0 }: HeroSubheadlineProps) {
  return (
    <motion.p
      className="mt-6 text-base md:text-lg text-muted-foreground max-w-lg mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.p>
  )
}

function FuturePulse() {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <span aria-hidden className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
      <motion.span
        className="font-heading font-extrabold leading-[0.95] tracking-tighter text-[clamp(3rem,8vw,8rem)]"
        animate={{ scale: [1, 1.02, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        Future
      </motion.span>
    </span>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"] as const,
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -100])
  const floatingOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const floatingY = useTransform(scrollYProgress, [0, 0.6], [0, -200])
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion
      ? ["#000000", "#000000", "#000000"]
      : ["#000000", "#000000", "#FFFFFF"]
  )
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion
      ? ["#FFFFFF", "#FFFFFF", "#FFFFFF"]
      : ["#FFFFFF", "#FFFFFF", "#111111"]
  )

  return (
    <motion.section
      ref={sectionRef}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.03" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
        style={{ opacity: heroOpacity, y: heroY, color: textColor }}
      >
        <div className="max-w-5xl mx-auto relative">
          <MagneticButton strength={0.15} radius={120}>
            <div className="text-[clamp(3rem,8vw,8rem)]">
              <LetterRevealHeadline />
            </div>
          </MagneticButton>
          <FuturePulse />
        </div>

        <HeroSubheadline delay={0.8}>
          Premium products curated for modern lifestyles.
        </HeroSubheadline>

        <HeroCTAGroup />

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Free shipping on orders over $100
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: floatingOpacity, y: floatingY }}
      >
        <HeroFloatingElements />
      </motion.div>

      <ScrollIndicator />
    </motion.section>
  )
}
