import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface ShoppablePostProps extends BaseComponentProps {
  id: string
  media: MediaField
  caption?: string
  author: { name: string; avatar?: string; handle?: string }
  taggedProducts: TaggedProduct[]
  likes?: number
  comments?: number
  postedAt: string
  variant?: "feed" | "grid" | "story"
}

export interface TaggedProduct {
  id: string
  title: string
  price: PriceData
  thumbnail?: string
  position?: { x: number; y: number }
}

export interface SocialSharePanelProps extends BaseComponentProps {
  url: string
  title: string
  description?: string
  image?: string
  platforms?: ("facebook" | "twitter" | "whatsapp" | "telegram" | "email" | "copy")[]
  onShare?: (platform: string) => void
}

export interface LiveShoppingEmbedProps extends BaseComponentProps {
  streamId: string
  streamUrl?: string
  products: TaggedProduct[]
  isLive: boolean
  viewerCount?: number
  hostName?: string
  onProductClick?: (productId: string) => void
}

export interface SocialProofPopupProps extends BaseComponentProps {
  message: string
  productTitle?: string
  customerName?: string
  location?: string
  timestamp?: string
  duration?: number
  position?: "bottom-start" | "bottom-end"
  onDismiss?: () => void
}

export interface ReferralWidgetProps extends BaseComponentProps {
  referralCode: string
  referralLink: string
  reward?: { type: "discount" | "credit" | "points"; value: string }
  referralCount?: number
  onCopyLink?: () => void
  onShare?: (platform: string) => void
}

export interface WishlistGridProps extends BaseComponentProps {
  items: WishlistItem[]
  onRemove?: (itemId: string) => void
  onMoveToCart?: (itemId: string) => void
  onShare?: () => void
  loading?: boolean
  empty?: boolean
}

export interface WishlistItem {
  id: string
  productId: string
  title: string
  thumbnail?: string
  price: PriceData
  inStock: boolean
  addedAt: string
}
