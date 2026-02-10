import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface CampaignCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  thumbnail?: MediaField
  goalAmount: PriceData
  raisedAmount: PriceData
  backersCount: number
  daysRemaining: number
  status: "active" | "funded" | "ended" | "cancelled"
  category?: string
  variant?: "default" | "compact" | "featured"
  onBack?: () => void
}

export interface CampaignProgressBarProps extends BaseComponentProps {
  raised: number
  goal: number
  currencyCode: string
  showPercentage?: boolean
  showAmounts?: boolean
  animated?: boolean
}

export interface BackerListProps extends BaseComponentProps {
  backers: Backer[]
  totalBackers: number
  showAmount?: boolean
  limit?: number
}

export interface Backer {
  id: string
  name: string
  avatar?: string
  amount: PriceData
  backedAt: string
  rewardTier?: string
}

export interface RewardTierProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  pledgeAmount: PriceData
  estimatedDelivery?: string
  limitedQuantity?: number
  claimed?: number
  includes?: string[]
  onPledge: (tierId: string) => void
}

export interface FlashSaleCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  originalPrice: PriceData
  salePrice: PriceData
  discountPercentage: number
  endsAt: string
  quantityTotal?: number
  quantitySold?: number
  variant?: "default" | "compact" | "banner"
}

export interface CountdownTimerProps extends BaseComponentProps {
  endsAt: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "compact" | "segmented"
  showLabels?: boolean
  onComplete?: () => void
}

export interface BundleBuilderProps extends BaseComponentProps {
  bundleId: string
  requiredItems: BundleItem[]
  optionalItems?: BundleItem[]
  totalPrice: PriceData
  savingsAmount?: PriceData
  selectedItems: string[]
  onItemToggle: (itemId: string) => void
  onAddToCart?: () => void
}

export interface BundleItem {
  id: string
  title: string
  thumbnail?: string
  price: PriceData
  required: boolean
  selected: boolean
}

export interface BundleSavingsProps extends BaseComponentProps {
  individualTotal: PriceData
  bundlePrice: PriceData
  savingsAmount: PriceData
  savingsPercentage: number
}

export interface CouponInputProps extends BaseComponentProps {
  onApply: (code: string) => void
  onRemove?: () => void
  appliedCode?: string
  discount?: PriceData
  loading?: boolean
  error?: string
}
