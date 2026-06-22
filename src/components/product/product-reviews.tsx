"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/shared/rating-stars"
import { ReviewCard } from "./review-card"
import { ReviewForm } from "./review-form"
import { MobileSectionCollapsible } from "./mobile-section-collapsible"
import type { ProductDetailReview } from "@/types/product"

interface ProductReviewsProps {
  reviews: ProductDetailReview[]
  averageRating: number
}

export function ProductReviews({ reviews, averageRating }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest")

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating
    if (sortBy === "lowest") return a.rating - b.rating
    return 0
  })

  const handleSubmit = (_data: { rating: number; title: string; body: string }) => {
    void _data
    // TODO: implement server action
  }

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <MobileSectionCollapsible
      title="Customer Reviews"
      icon={<MessageSquare className="w-4 h-4" strokeWidth={1.5} />}
      defaultOpen={reviews.length > 0}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={averageRating} size="sm" />
              <span className="text-sm text-muted-foreground">
                {averageRating > 0 ? averageRating.toFixed(1) : "No reviews yet"}
                {reviews.length > 0 && ` (${reviews.length})`}
              </span>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="outline"
            className="rounded-none gap-2 text-xs h-9"
          >
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
            Write a Review
          </Button>
        </div>

        <AnimatePresence>
          {showForm && <ReviewForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
        </AnimatePresence>

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground">
                Rating Breakdown
              </h4>
              <div className="space-y-2">
                {ratingCounts.map(({ star, count }) => {
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-muted-foreground tabular-nums">{star}</span>
                      <div className="flex-1 h-2 bg-secondary border border-border overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full bg-foreground"
                        />
                      </div>
                      <span className="w-6 text-right text-muted-foreground tabular-nums">{count}</span>
                    </div>
                  )
                })}
              </div>

              <div className="pt-3">
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                  Sort
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full text-xs h-8 px-2 border border-border bg-background rounded-none"
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {sorted.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {reviews.length === 0 && !showForm && (
          <div className="text-center py-12 border border-border">
            <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product.</p>
          </div>
        )}
      </div>
    </MobileSectionCollapsible>
  )
}
