"use client"

import { HelpCircle } from "lucide-react"
import { FaqItem } from "./faq-item"
import { MobileSectionCollapsible } from "./mobile-section-collapsible"

export interface FaqData {
  question: string
  answer: string
}

interface ProductFaqProps {
  items: FaqData[]
}

export function ProductFaq({ items }: ProductFaqProps) {
  if (items.length === 0) return null

  return (
    <MobileSectionCollapsible
      title="FAQ"
      icon={<HelpCircle className="w-4 h-4" strokeWidth={1.5} />}
    >
      <div>
        {items.map((faq, i) => (
          <FaqItem key={i} question={faq.question} answer={faq.answer} defaultOpen={i === 0} />
        ))}
      </div>
    </MobileSectionCollapsible>
  )
}
