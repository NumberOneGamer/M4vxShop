import { getApprovedReviews } from "@/server/actions/review-actions"
import { TestimonialCard } from "./testimonial-card"

export async function TestimonialsScroll() {
  const reviews = await getApprovedReviews()

  if (reviews.length === 0) {
    return (
      <p className="text-center text-muted-foreground text-sm">
        No reviews yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto no-scrollbar pb-4">
      <div className="flex gap-6">
        {reviews.map((review) => (
          <TestimonialCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
