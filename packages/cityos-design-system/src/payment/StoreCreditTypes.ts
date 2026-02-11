import type { BaseComponentProps } from "../components/ComponentTypes"

export interface StoreCreditTransaction {
  id: string
  type: "earned" | "spent" | "expired" | "refund" | "adjustment"
  amount: number
  description: string
  timestamp: string
  orderId?: string
  balance: number
}

export interface StoreCreditBalanceProps extends BaseComponentProps {
  balance: number
  currency?: string
  expiringAmount?: number
  expiringDate?: string
  locale?: string
  loading?: boolean
}

export interface StoreCreditHistoryProps extends BaseComponentProps {
  transactions: StoreCreditTransaction[]
  currency?: string
  locale?: string
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

export interface StoreCreditApplyProps extends BaseComponentProps {
  balance: number
  currency?: string
  appliedAmount?: number
  maxApplicable?: number
  onApply?: (amount: number) => void
  onRemove?: () => void
  locale?: string
  loading?: boolean
}
