export interface Vendor {
  id: string
  handle: string
  name: string
  description?: string
  logo_url?: string
  banner_url?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  is_verified: boolean
  is_featured: boolean
  status: "active" | "suspended" | "inactive" | "pending"
  rating?: number
  review_count?: number
  product_count?: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface VendorStats {
  total_products: number
  total_orders: number
  total_sales: number
  average_rating: number
  review_count: number
  response_rate?: number
  response_time_hours?: number
}

export interface VendorFilters {
  category?: string
  is_verified?: boolean
  is_featured?: boolean
  min_rating?: number
  search?: string
}
