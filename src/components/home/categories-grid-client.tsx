"use client"

import { motion } from "framer-motion"
import { CategoryCard } from "./category-card"
import type { Category } from "@/types/category"

interface CategoriesGridClientProps {
  categories: Category[]
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function CategoriesGridClient({
  categories,
}: CategoriesGridClientProps) {
  if (categories.length === 0) return null

  const [first, second, third, fourth, fifth] = categories

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Categories
          </span>
          <h2 className="mt-3 font-heading font-bold text-3xl md:text-5xl tracking-tight">
            Shop By Category
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            Explore our curated categories — from cutting-edge tech to everyday essentials.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {first && (
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 lg:col-span-2 md:row-span-2"
            >
              <CategoryCard category={first} />
            </motion.div>
          )}
          {second && (
            <motion.div variants={itemVariants}>
              <CategoryCard category={second} />
            </motion.div>
          )}
          {third && (
            <motion.div variants={itemVariants}>
              <CategoryCard category={third} />
            </motion.div>
          )}
          {fourth && (
            <motion.div variants={itemVariants}>
              <CategoryCard category={fourth} />
            </motion.div>
          )}
          {fifth && (
            <motion.div variants={itemVariants}>
              <CategoryCard category={fifth} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
