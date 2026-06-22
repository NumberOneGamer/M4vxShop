"use client"

import { FloatingElement } from "@/components/animations/floating-element"
import { HeroMouseParallax } from "./hero-mouse-parallax"

const PRODUCTS = [
  { src: "/placeholder.svg", alt: "Product 1", parallaxFactor: 0.03, floatAmplitude: 12, floatDuration: 4, className: "top-[10%] left-[8%] w-20 h-20 md:w-28 md:h-28" },
  { src: "/placeholder.svg", alt: "Product 2", parallaxFactor: 0.05, floatAmplitude: 8, floatDuration: 5, className: "top-[15%] right-[10%] w-24 h-24 md:w-32 md:h-32" },
  { src: "/placeholder.svg", alt: "Product 3", parallaxFactor: 0.04, floatAmplitude: 15, floatDuration: 3.5, className: "bottom-[20%] left-[12%] w-16 h-16 md:w-24 md:h-24" },
  { src: "/placeholder.svg", alt: "Product 4", parallaxFactor: 0.06, floatAmplitude: 10, floatDuration: 6, className: "bottom-[15%] right-[8%] w-28 h-28 md:w-36 md:h-36" },
  { src: "/placeholder.svg", alt: "Product 5", parallaxFactor: 0.02, floatAmplitude: 6, floatDuration: 4.5, className: "top-[40%] left-[4%] w-14 h-14 md:w-20 md:h-20 hidden md:block" },
  { src: "/placeholder.svg", alt: "Product 6", parallaxFactor: 0.07, floatAmplitude: 14, floatDuration: 3, className: "top-[35%] right-[4%] w-16 h-16 md:w-22 md:h-22 hidden lg:block" },
]

export function HeroFloatingElements() {
  return (
    <>
      {PRODUCTS.map((product, i) => (
        <HeroMouseParallax key={i} factor={product.parallaxFactor} className={product.className}>
          <FloatingElement
            amplitude={product.floatAmplitude}
            duration={product.floatDuration}
            delay={i * 0.2}
          >
            <div className="relative w-full h-full bg-secondary rounded-sm overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                Product
              </div>
            </div>
          </FloatingElement>
        </HeroMouseParallax>
      ))}
    </>
  )
}
