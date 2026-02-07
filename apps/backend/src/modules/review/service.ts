import { MedusaService } from "@medusajs/framework/utils"
import { Review } from "./models/review"

class ReviewModuleService extends MedusaService({
  Review,
}) {
  async createReview(data: {
    rating: number
    title?: string
    content: string
    customer_id: string
    customer_name?: string
    customer_email?: string
    product_id?: string
    vendor_id?: string
    order_id?: string
    is_verified_purchase?: boolean
    images?: string[]
    metadata?: Record<string, unknown>
  }) {
    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5")
    }

    // Must have either product_id or vendor_id
    if (!data.product_id && !data.vendor_id) {
      throw new Error("Review must be for a product or vendor")
    }

    const review = await this.createReviews({
      ...data,
      is_approved: false, // Reviews require approval by default
      helpful_count: 0,
    })

    return review
  }

  async listProductReviews(
    productId: string,
    options?: {
      limit?: number
      offset?: number
      approved_only?: boolean
    }
  ) {
    const filters: Record<string, any> = {
      product_id: productId,
    }

    if (options?.approved_only !== false) {
      filters.is_approved = true
    }

    const reviews = await this.listReviews(filters, {
      take: options?.limit || 10,
      skip: options?.offset || 0,
      order: { created_at: "DESC" },
    })

    return reviews
  }

  async listVendorReviews(
    vendorId: string,
    options?: {
      limit?: number
      offset?: number
      approved_only?: boolean
    }
  ) {
    const filters: Record<string, any> = {
      vendor_id: vendorId,
    }

    if (options?.approved_only !== false) {
      filters.is_approved = true
    }

    const reviews = await this.listReviews(filters, {
      take: options?.limit || 10,
      skip: options?.offset || 0,
      order: { created_at: "DESC" },
    })

    return reviews
  }

  async getProductRatingSummary(productId: string) {
    const reviews = await this.listReviews(
      { product_id: productId, is_approved: true },
      { select: ["rating"] }
    )

    if (reviews.length === 0) {
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0

    for (const review of reviews) {
      totalRating += review.rating
      distribution[review.rating as keyof typeof distribution]++
    }

    return {
      average_rating: Math.round((totalRating / reviews.length) * 10) / 10,
      total_reviews: reviews.length,
      rating_distribution: distribution,
    }
  }

  async approveReview(reviewId: string) {
    return this.updateReviews({ id: reviewId }, { is_approved: true })
  }

  async rejectReview(reviewId: string) {
    return this.deleteReviews(reviewId)
  }

  async markHelpful(reviewId: string) {
    const review = await this.retrieveReview(reviewId)
    return this.updateReviews(
      { id: reviewId },
      { helpful_count: (review.helpful_count || 0) + 1 }
    )
  }
}

export default ReviewModuleService
