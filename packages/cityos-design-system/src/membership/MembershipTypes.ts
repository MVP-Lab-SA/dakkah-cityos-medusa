import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface MembershipTierCardProps extends BaseComponentProps {
  id: string
  name: string
  description?: string
  price: PriceData
  billingPeriod: "monthly" | "yearly" | "lifetime"
  benefits: MembershipBenefit[]
  isCurrent?: boolean
  isPopular?: boolean
  onSelect?: () => void
  variant?: "default" | "featured" | "compact"
}

export interface MembershipBenefit {
  id: string
  title: string
  description?: string
  icon?: string
  included: boolean
  value?: string
}

export interface MembershipStatusProps extends BaseComponentProps {
  tier: string
  status: "active" | "expired" | "cancelled" | "paused"
  expiresAt?: string
  renewalDate?: string
  benefits: MembershipBenefit[]
  onRenew?: () => void
  onCancel?: () => void
  onUpgrade?: () => void
}

export interface BenefitsListProps extends BaseComponentProps {
  benefits: MembershipBenefit[]
  showAll?: boolean
  maxVisible?: number
  variant?: "list" | "grid" | "compact"
}

export interface MembershipComparisonProps extends BaseComponentProps {
  tiers: MembershipTierCardProps[]
  currentTierId?: string
  onTierSelect: (tierId: string) => void
}

export interface LoyaltyPointsDisplayProps extends BaseComponentProps {
  points: number
  tier?: string
  nextTier?: { name: string; pointsRequired: number }
  pointsToNextTier?: number
  expiringPoints?: { amount: number; expiresAt: string }
  variant?: "compact" | "detailed" | "card"
}

export interface RewardsCatalogProps extends BaseComponentProps {
  rewards: RewardItem[]
  userPoints: number
  onRedeem: (rewardId: string) => void
  loading?: boolean
}

export interface RewardItem {
  id: string
  title: string
  description?: string
  thumbnail?: string
  pointsCost: number
  category?: string
  available: boolean
  expiresAt?: string
}

export interface PointsHistoryProps extends BaseComponentProps {
  entries: PointsEntry[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export interface PointsEntry {
  id: string
  type: "earned" | "redeemed" | "expired" | "adjusted"
  amount: number
  description: string
  timestamp: string
  orderId?: string
}
