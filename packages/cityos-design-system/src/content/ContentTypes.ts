import type { BaseComponentProps } from "../components/ComponentTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface BlogPostCardProps extends BaseComponentProps {
  id: string
  title: string
  slug: string
  excerpt?: string
  thumbnail?: MediaField
  author?: { name: string; avatar?: string }
  publishedAt: string
  category?: string
  tags?: string[]
  readingTime?: string
  variant?: "default" | "compact" | "featured" | "horizontal"
}

export interface BlogPostDetailProps extends BaseComponentProps {
  id: string
  title: string
  content: string
  thumbnail?: MediaField
  author?: { name: string; avatar?: string; bio?: string }
  publishedAt: string
  updatedAt?: string
  category?: string
  tags?: string[]
  readingTime?: string
  relatedPosts?: BlogPostCardProps[]
}

export interface BlogSidebarProps extends BaseComponentProps {
  categories?: { name: string; slug: string; count: number }[]
  recentPosts?: BlogPostCardProps[]
  tags?: { name: string; count: number }[]
  searchEnabled?: boolean
}

export interface ArticleSearchProps extends BaseComponentProps {
  onSearch: (query: string) => void
  placeholder?: string
  results?: BlogPostCardProps[]
  loading?: boolean
}

export interface HelpCenterProps extends BaseComponentProps {
  categories: HelpCategory[]
  featuredArticles?: HelpArticle[]
  searchEnabled?: boolean
  onSearch?: (query: string) => void
}

export interface HelpCategory {
  id: string
  title: string
  description?: string
  icon?: string
  articleCount: number
  slug: string
}

export interface HelpArticle {
  id: string
  title: string
  excerpt?: string
  category: string
  slug: string
  helpful?: { yes: number; no: number }
  updatedAt?: string
}

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
  variant?: "default" | "compact" | "map-popup"
}

export interface POIMapViewProps extends BaseComponentProps {
  pois: POICardProps[]
  center?: { lat: number; lng: number }
  zoom?: number
  selectedPOIId?: string
  onPOISelect?: (id: string) => void
  height?: string
  showSearch?: boolean
  showCategories?: boolean
}

export interface POIDetailProps extends BaseComponentProps {
  poi: POICardProps & {
    fullDescription?: string
    photos?: MediaField[]
    reviews?: { average: number; count: number }
    amenities?: string[]
    website?: string
    socialLinks?: Record<string, string>
  }
}

export interface AnnouncementCardProps extends BaseComponentProps {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "critical" | "promotion"
  publishedAt: string
  expiresAt?: string
  pinned?: boolean
}
