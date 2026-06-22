"use client"

import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon: React.ReactNode
  trend?: { value: string; positive: boolean }
}

export function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {(description ?? trend) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {trend && (
            <span className={trend.positive ? "text-foreground" : "text-destructive"}>
              {trend.positive ? "+" : ""}{trend.value}
            </span>
          )}
          {description && <span>{description}</span>}
        </div>
      )}
    </motion.div>
  )
}
