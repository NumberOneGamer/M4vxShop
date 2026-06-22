"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"

interface TopProductsTableProps {
  products: {
    id: string
    name: string
    slug: string
    price: number
    image: string | null
    totalSold: number
  }[]
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="border border-border"
    >
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Top Selling Products</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs uppercase tracking-wider">Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product.id} className="border-b border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs w-4">{i + 1}.</span>
                    <div className="h-8 w-8 bg-muted flex items-center justify-center text-[10px] text-muted-foreground overflow-hidden relative">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="32px" />
                      ) : (
                        "—"
                      )}
                    </div>
                    <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatPrice(product.price)}</td>
                <td className="px-4 py-3 text-right font-medium">{product.totalSold}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  No products sold yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
