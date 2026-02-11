import type { BaseComponentProps } from "../components/ComponentTypes"

export interface ReferralTier {
  id: string
  name: string
  minReferrals: number
  rewardMultiplier: number
  benefits?: string[]
}

export interface ReferralHistory {
  id: string
  referredEmail: string
  status: "pending" | "completed" | "expired"
  reward: number
  date: string
}

export interface ReferralDashboardProps extends BaseComponentProps {
  code: string
  link: string
  totalReferred: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarned: number
  currencyCode?: string
  rewardDescription: string
  history: ReferralHistory[]
  currentTier?: ReferralTier
  nextTier?: ReferralTier
  onInvite?: (email: string) => void
  locale?: string
}

export interface ReferralCodeCardProps extends BaseComponentProps {
  code: string
  link: string
  rewardDescription?: string
  locale?: string
}

export interface ReferralStatsProps extends BaseComponentProps {
  totalReferred: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarned: number
  currencyCode?: string
  locale?: string
}

export interface ReferralRewardProps extends BaseComponentProps {
  currentTier?: ReferralTier
  nextTier?: ReferralTier
  currentReferrals: number
  locale?: string
}

export interface InviteFriendFormProps extends BaseComponentProps {
  onInvite: (email: string) => void
  loading?: boolean
  success?: boolean
  error?: string
  locale?: string
}
