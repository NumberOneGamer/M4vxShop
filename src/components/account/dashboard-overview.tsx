"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Heart, Clock, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"
import type { FeaturedProduct } from "@/types/product"

interface DashboardOverviewProps {
  userName: string | null
  stats: {
    totalOrders: number
    totalSpent: number
    wishlistCount: number
  }
  recentOrders: {
    orderNumber: string
    total: number
    status: string
    createdAt: Date
  }[]
  recommendations?: FeaturedProduct[]
}

export function DashboardOverview({ userName, stats, recentOrders, recommendations }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your orders, wishlist, and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border p-4 space-y-1">
          <Package className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-2xl font-semibold">{stats.totalOrders}</p>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </div>
        <div className="border border-border p-4 space-y-1">
          <Clock className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-2xl font-semibold">{formatPrice(stats.totalSpent)}</p>
          <p className="text-sm text-muted-foreground">Total Spent</p>
        </div>
        <div className="border border-border p-4 space-y-1">
          <Heart className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-2xl font-semibold">{stats.wishlistCount}</p>
          <p className="text-sm text-muted-foreground">Wishlist Items</p>
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recommendations.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/${product.slug}`} className="block text-left group">
                  <div className="aspect-square border border-border bg-secondary overflow-hidden mb-2 relative">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.imageAlt ?? product.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        sizes="180px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    ${product.price.toFixed(2)}
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="line-through ml-1.5 text-xs">
                        ${product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="border border-border divide-y divide-border">
            {recentOrders.map((order) => (
              <Link
                key={order.orderNumber}
                href={`/account/orders/${order.orderNumber}`}
                className="flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                  <p className="text-xs capitalize text-muted-foreground">{order.status.toLowerCase()}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
