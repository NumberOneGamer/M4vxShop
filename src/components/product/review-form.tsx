"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  onClose: () => void
  onSubmit: (data: { rating: number; title: string; body: string }) => void
}

export function ReviewForm({ onClose, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const isComplete = rating > 0 && title.trim().length > 0 && body.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isComplete) return
    onSubmit({ rating, title, body })
    setRating(0)
    setTitle("")
    setBody("")
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="border border-border p-5 space-y-4 bg-secondary/30"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Write a Review</h4>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-secondary transition-colors"
            aria-label="Close review form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hoverRating || rating)
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star === rating ? 0 : star)}
                  className="p-0.5 transition-transform hover:scale-110"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={cn(
                      "w-5 h-5 transition-colors",
                      active ? "text-foreground fill-foreground" : "text-muted-foreground/30"
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="review-title" className="text-xs uppercase tracking-wider text-muted-foreground">
            Title
          </label>
          <Input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summary of your review"
            className="rounded-none text-sm h-10"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="review-body" className="text-xs uppercase tracking-wider text-muted-foreground">
            Review
          </label>
          <Textarea
            id="review-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience with this product..."
            className="rounded-none text-sm min-h-[100px] resize-y"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={!isComplete}
          className="w-full rounded-none text-sm h-10"
        >
          Submit Review
        </Button>
      </form>
    </motion.div>
  )
}
