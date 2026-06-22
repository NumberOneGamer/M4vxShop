"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  reviewCount?: number
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  reviewCount,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of ${maxRating} stars`}>
        {Array.from({ length: maxRating }).map((_, i) => {
          const fillPercentage = Math.min(Math.max((rating - i) * 100, 0), 100)
          return (
            <span key={i} className="relative inline-block">
              <Star
                className={cn(
                  sizeMap[size],
                  "text-muted-foreground/30"
                )}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  className={cn(sizeMap[size], "text-foreground")}
                  fill="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
            </span>
          )
        })}
      </div>
      {(showValue || reviewCount !== undefined) && (
        <span className="text-xs text-muted-foreground">
          {showValue && rating > 0 && <span>{rating.toFixed(1)}</span>}
          {reviewCount !== undefined && (
            <span>
              {showValue && rating > 0 ? " " : ""}({reviewCount})
            </span>
          )}
        </span>
      )}
    </div>
  )
}
