"use client"

import { motion } from "framer-motion"

interface ConversionChartProps {
  rate: string
  totalViews: number
  totalOrders: number
}

export function ConversionChart({ rate, totalViews, totalOrders }: ConversionChartProps) {
  const pct = Math.min(Number(rate) / 10, 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="border border-border"
    >
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Conversion Rate</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <p className="text-3xl font-semibold">{rate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Overall conversion</p>
        </div>
        <div className="h-2 bg-muted overflow-hidden">
          <div className="h-full bg-foreground transition-all duration-500" style={{ width: `${pct * 100}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{totalViews.toLocaleString()} page views</span>
          <span>{totalOrders.toLocaleString()} orders</span>
        </div>
      </div>
    </motion.div>
  )
}
