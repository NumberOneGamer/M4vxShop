"use client"

import { motion } from "framer-motion"

interface RevenueChartProps {
  data: { date: string; revenue: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(n)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="border border-border"
    >
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Revenue (30 days)</h3>
      </div>
      <div className="p-4">
        <div className="h-48 flex items-end gap-[2px]">
          {data.map((point, i) => (
            <div
              key={i}
              className="flex-1 bg-foreground/10 hover:bg-foreground/20 transition-colors relative group"
              style={{ height: `${(point.revenue / maxRevenue) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatCurrency(point.revenue)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">{data[0]?.date?.slice(5) ?? ""}</span>
          <span className="text-[10px] text-muted-foreground">{data[data.length - 1]?.date?.slice(5) ?? ""}</span>
        </div>
      </div>
    </motion.div>
  )
}
