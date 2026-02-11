import type { BaseComponentProps } from "../components/ComponentTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface POICardProps extends BaseComponentProps {
  id: string
  name: string
  description?: string
  thumbnail?: MediaField
  category?: string
  address: string
  lat: number
  lng: number
  rating?: { average: number; count: number }
  phone?: string
  hours?: string
  distance?: string
  priceLevel?: number
  variant?: "default" | "compact" | "map-popup"
  locale?: string
}

export interface POIDetailProps extends BaseComponentProps {
  id: string
  name: string
  description?: string
  fullDescription?: string
  thumbnail?: MediaField
  photos?: MediaField[]
  category?: string
  address: string
  lat: number
  lng: number
  rating?: { average: number; count: number }
  phone?: string
  email?: string
  website?: string
  hours?: string
  hoursDetail?: { day: string; open: string; close: string }[]
  amenities?: string[]
  priceLevel?: number
  socialLinks?: Record<string, string>
  reviews?: POIReviewItem[]
  locale?: string
}

export interface POIMapViewProps extends BaseComponentProps {
  pois: POICardProps[]
  center?: { lat: number; lng: number }
  zoom?: number
  selectedPOIId?: string
  onPOISelect?: (id: string) => void
  height?: string
  locale?: string
}

export interface POIFilterBarProps extends BaseComponentProps {
  categories: string[]
  selectedCategory?: string
  onCategoryChange: (category: string | undefined) => void
  sortBy?: string
  onSortChange?: (sort: string) => void
  ratingFilter?: number
  onRatingFilterChange?: (rating: number | undefined) => void
  locale?: string
}

export interface POIGalleryProps extends BaseComponentProps {
  images: MediaField[]
  name?: string
  locale?: string
}

export interface POIReviewItem {
  id: string
  author: string
  avatar?: string
  rating: number
  content: string
  createdAt: string
  helpful?: number
}

export interface POIReviewsProps extends BaseComponentProps {
  reviews: POIReviewItem[]
  averageRating?: number
  totalCount?: number
  locale?: string
}
