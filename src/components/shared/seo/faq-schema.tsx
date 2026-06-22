import { JsonLd } from "./json-ld"

interface FaqItem {
  question: string
  answer: string
}

interface FaqSchemaProps {
  items: FaqItem[]
}

export function FaqSchema({ items }: FaqSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return <JsonLd data={data} />
}
