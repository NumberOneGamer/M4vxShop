"use client"

import { Counter } from "@/components/animations/counter"

interface StatItemProps {
  value: number
  suffix: string
  label: string
}

export function StatItem({ value, suffix, label }: StatItemProps) {
  return (
    <Counter
      from={0}
      to={value}
      suffix={suffix}
      label={label}
      duration={1.5}
    />
  )
}
