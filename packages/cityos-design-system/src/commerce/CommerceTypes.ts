import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface ProductCardProps extends BaseComponentProps {
  id: string
  title: string
  handle: string
  thumbnail?: string
  images?: MediaField[]
  price: PriceData
  compareAtPrice?: PriceData
  vendor?: { id: string; name: string; slug?: string }
  rating?: { average: number; count: number }
  badges?: string[]
  variant?: "default" | "compact" | "detailed" | "horizontal"
  showQuickAdd?: boolean
  showWishlist?: boolean
  onQuickAdd?: () => void
  onWishlistToggle?: () => void
}

export interface PriceData {
  amount: number
  currencyCode: string
  formatted?: string
}

export interface PriceDisplayProps extends BaseComponentProps {
  price: PriceData
  compareAtPrice?: PriceData
  size?: Size
  showCurrency?: boolean
  showDiscount?: boolean
}

export interface CartItemProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  quantity: number
  price: PriceData
  variant?: { title: string; options?: Record<string, string> }
  vendor?: { id: string; name: string }
  maxQuantity?: number
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
}

export interface OrderSummaryProps extends BaseComponentProps {
  subtotal: PriceData
  shipping?: PriceData
  tax?: PriceData
  discount?: PriceData
  total: PriceData
  items?: number
  showBreakdown?: boolean
}

export interface RatingProps extends BaseComponentProps {
  value: number
  max?: number
  size?: Size
  showValue?: boolean
  showCount?: boolean
  count?: number
  interactive?: boolean
  onChange?: (value: number) => void
}

export interface InventoryBadgeProps extends BaseComponentProps {
  status: "in-stock" | "low-stock" | "out-of-stock" | "pre-order" | "backorder"
  quantity?: number
  threshold?: number
}

export interface QuantitySelectorProps extends BaseComponentProps {
  value: number
  min?: number
  max?: number
  step?: number
  size?: Size
  disabled?: boolean
  onChange: (value: number) => void
}

export interface WishlistButtonProps extends BaseComponentProps {
  productId: string
  active?: boolean
  size?: Size
  onToggle?: (productId: string) => void
}

export interface FilterGroupProps extends BaseComponentProps {
  title: string
  type: "checkbox" | "radio" | "range" | "color" | "size"
  options: { label: string; value: string; count?: number }[]
  selected?: string[]
  onChange?: (values: string[]) => void
  collapsible?: boolean
  defaultOpen?: boolean
}

export interface SortSelectProps extends BaseComponentProps {
  options: { label: string; value: string }[]
  value?: string
  onChange?: (value: string) => void
}

export interface ProductQuickViewProps extends BaseComponentProps {
  productId: string
  open: boolean
  onClose: () => void
}

export interface VendorCardProps extends BaseComponentProps {
  id: string
  name: string
  slug?: string
  logo?: string
  coverImage?: string
  description?: string
  rating?: { average: number; count: number }
  productCount?: number
  badges?: string[]
  verified?: boolean
  variant?: "default" | "compact" | "featured"
}
