"use client"

import Image from "next/image"
import { ThumbsUp, CheckCircle } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { RatingStars } from "@/components/shared/rating-stars"
import { cn } from "@/lib/utils"
import type { ProductDetailReview } from "@/types/product"

interface ReviewCardProps {
  review: ProductDetailReview
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.user.name
    ? review.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??"

  return (
    <div className="border border-border p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 rounded-none border border-border">
            {review.user.image ? (
              <AvatarImage src={review.user.image} alt={review.user.name ?? ""} />
            ) : null}
            <AvatarFallback className="rounded-none text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{review.user.name ?? "Anonymous"}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingStars rating={review.rating} size="sm" />
              {review.isVerified && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <CheckCircle className="w-3 h-3" strokeWidth={1.5} />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {review.title && (
        <h4 className="text-sm font-medium">{review.title}</h4>
      )}
      {review.body && (
        <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
      )}

      {review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {review.images.map((img, i) => (
            <div key={i} className="relative flex-shrink-0 w-16 h-16 border border-border bg-secondary overflow-hidden">
              <Image
                src={img}
                alt={`Review image ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Verified Purchase
        </span>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 text-xs text-muted-foreground",
            "hover:text-foreground transition-colors"
          )}
          aria-label="Mark as helpful"
        >
          <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{review.helpfulCount}</span>
        </button>
      </div>
    </div>
  )
}
