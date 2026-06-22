"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const CHECKOUT_STEPS = [
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
] as const

export type CheckoutStepId = (typeof CHECKOUT_STEPS)[number]["id"]

interface CheckoutStepsProps {
  current: CheckoutStepId
}

export function CheckoutSteps({ current }: CheckoutStepsProps) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === current)

  return (
    <div className="flex items-center gap-0">
      {CHECKOUT_STEPS.map((step, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex
        const isLast = i === CHECKOUT_STEPS.length - 1

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                  isCompleted && "bg-foreground text-background border-foreground",
                  isCurrent && "border-foreground text-foreground",
                  !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
                {isCurrent && (
                  <motion.span
                    layoutId="step-indicator"
                    className="absolute inset-0 rounded-full border-2 border-foreground"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "hidden sm:inline text-sm",
                  isCurrent && "font-medium text-foreground",
                  isCompleted && "text-muted-foreground",
                  !isCompleted && !isCurrent && "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-px mx-3 transition-colors",
                  i < currentIndex ? "bg-foreground" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
