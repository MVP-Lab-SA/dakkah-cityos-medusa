export interface Review {
  id: string
  rating: number
  title?: string
  content: string
  customer_id?: string
  product_id?: string
  vendor_id?: string
  order_id?: string
  is_verified: boolean
  is_approved: boolean
  helpful_count: number
  images?: string[]
  customer?: {
    first_name?: string
    last_name?: string
  }
  created_at: string
  updated_at: string
}

export interface ReviewSummary {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  verified_percentage: number
}

export interface CreateReviewInput {
  rating: number
  title?: string
  content: string
  product_id?: string
  vendor_id?: string
  order_id?: string
  images?: string[]
}

export interface ReviewFilters {
  rating?: number
  verified_only?: boolean
  sort_by?: "newest" | "oldest" | "highest" | "lowest" | "most_helpful"
}
