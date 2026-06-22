"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReviewWithUser } from "@/types/review"

interface TestimonialCardProps {
  review: ReviewWithUser
}

export function TestimonialCard({ review }: TestimonialCardProps) {
  const initials = (review.user.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      className="flex-shrink-0 w-[340px] md:w-[400px] border border-border bg-background p-6"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < review.rating
                ? "fill-foreground text-foreground"
                : "fill-none text-muted-foreground/30"
            )}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
        &ldquo;{review.body ?? review.title ?? ""}&rdquo;
      </p>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-medium overflow-hidden relative">
          {review.user.image ? (
            <Image
              src={review.user.image}
              alt={review.user.name ?? ""}
              fill
              className="object-cover"
              sizes="36px"
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="text-sm font-medium leading-tight">
            {review.user.name ?? "Anonymous"}
          </p>
          <p className="text-xs text-muted-foreground">
            Verified Buyer
          </p>
        </div>
      </div>
    </motion.div>
  )
}
