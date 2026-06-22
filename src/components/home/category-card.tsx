"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"

interface CategoryCardProps {
  category: Category
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const productCount = category._count?.products ?? 0

  return (
    <Link href={`/shop/category/${category.slug}`} className="block h-full">
      <motion.div
        ref={cardRef}
        className={cn(
          "relative h-full min-h-[200px] border border-border bg-background overflow-hidden group cursor-pointer",
          className
        )}
        whileHover="hover"
        initial="idle"
      >
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 transition-all duration-500 group-hover:from-black/80 group-hover:via-black/40" />

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-5"
          variants={{
            idle: { y: 0 },
            hover: { y: -4 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h3 className="font-heading font-bold text-xl text-white tracking-tight">
            {category.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-white/60">
              {productCount} {productCount === 1 ? "Product" : "Products"}
            </p>
            <motion.div
              variants={{
                idle: { opacity: 0, x: -8, rotate: 0 },
                hover: { opacity: 1, x: 0, rotate: 45 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ArrowUpRight className="h-4 w-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {category.description && (
          <div className="absolute top-0 left-0 right-0 p-5">
            <p className="text-xs text-white/40 line-clamp-2">{category.description}</p>
          </div>
        )}
      </motion.div>
    </Link>
  )
}
