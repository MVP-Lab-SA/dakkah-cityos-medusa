import { useState } from "react"
import { StarRatingInput } from "./star-rating"
import { useCreateReview } from "@/lib/hooks/use-reviews"
import { Button } from "@/components/ui/button"

interface ReviewFormProps {
  productId?: string
  vendorId?: string
  orderId?: string
  onSuccess?: () => void
}

export function ReviewForm({
  productId,
  vendorId,
  orderId,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  const createReview = useCreateReview()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (content.trim().length < 10) {
      setError("Review must be at least 10 characters")
      return
    }

    try {
      await createReview.mutateAsync({
        rating,
        title: title.trim() || undefined,
        content: content.trim(),
        product_id: productId,
        vendor_id: vendorId,
        order_id: orderId,
      })

      // Reset form
      setRating(0)
      setTitle("")
      setContent("")
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || "Failed to submit review")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-2">
          Your Rating
        </label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-2">
          Review Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          className="w-full px-4 py-2 border border-ui-border-base rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive"
          maxLength={100}
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-ui-fg-base mb-2">
          Your Review
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full px-4 py-2 border border-ui-border-base rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-fg-interactive resize-none"
          minLength={10}
          maxLength={1000}
        />
        <p className="text-xs text-ui-fg-muted mt-1">
          {content.length}/1000 characters
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={createReview.isPending}
      >
        {createReview.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
