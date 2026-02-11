import type { BaseComponentProps } from "../components/ComponentTypes"

export interface LoyaltyTier {
  name: string
  minPoints: number
  color?: string
  icon?: string
  benefits?: string[]
}

export interface LoyaltyActivity {
  id: string
  type: "earned" | "redeemed" | "expired"
  points: number
  description: string
  date: string
  orderId?: string
}

export interface LoyaltyReward {
  id: string
  title: string
  description: string
  pointsCost: number
  thumbnail?: string
  category?: string
  available: boolean
  expiresAt?: string
  stock?: number
}

export interface EarnRule {
  id: string
  action: string
  description: string
  pointsReward: number
  multiplier?: number
  icon?: string
}

export interface LoyaltyDashboardProps extends BaseComponentProps {
  balance: number
  lifetimeEarned?: number
  currentTier: string
  nextTier?: string
  tierProgress: number
  pointsToNextTier: number
  expiringPoints?: number
  expiringDate?: string
  recentActivity: LoyaltyActivity[]
  rewards: LoyaltyReward[]
  earnRules?: EarnRule[]
  onRedeem?: (rewardId: string) => void
  locale?: string
}

export interface PointsBalanceProps extends BaseComponentProps {
  balance: number
  lifetimeEarned?: number
  lifetimeRedeemed?: number
  animated?: boolean
  locale?: string
}

export interface TierProgressProps extends BaseComponentProps {
  currentTier: string
  nextTier?: string
  progress: number
  pointsToNextTier: number
  tiers?: LoyaltyTier[]
  locale?: string
}

export interface RewardCardProps extends BaseComponentProps {
  reward: LoyaltyReward
  userBalance: number
  onRedeem?: (rewardId: string) => void
  locale?: string
}

export interface PointsHistoryProps extends BaseComponentProps {
  activities: LoyaltyActivity[]
  hasMore?: boolean
  onLoadMore?: () => void
  locale?: string
}

export interface RedeemRewardFormProps extends BaseComponentProps {
  reward: LoyaltyReward
  userBalance: number
  onConfirm: (rewardId: string) => void
  onCancel: () => void
  loading?: boolean
  locale?: string
}

export interface EarnRulesListProps extends BaseComponentProps {
  rules: EarnRule[]
  locale?: string
}
