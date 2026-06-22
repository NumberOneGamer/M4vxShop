"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FaqItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium group-hover:text-muted-foreground transition-colors">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          strokeWidth={1.5}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground leading-relaxed pb-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
