import type { BaseComponentProps } from "../components/ComponentTypes"

export interface TBYBProgramCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  trialDays: number
  maxItems?: number
  returnShippingFree?: boolean
  thumbnail?: string
  onEnroll?: () => void
}

export interface TrialOrderCardProps extends BaseComponentProps {
  id: string
  orderNumber: string
  status: "active" | "returning" | "completed" | "converted" | "expired"
  items: { id: string; title: string; thumbnail?: string; price: { amount: number; currencyCode: string }; kept?: boolean }[]
  trialEndsAt: string
  createdAt: string
  onKeepItems?: (itemIds: string[]) => void
  onReturnAll?: () => void
}

export interface TrialItemSelectorProps extends BaseComponentProps {
  items: { id: string; title: string; thumbnail?: string; price: { amount: number; currencyCode: string }; sizes?: string[]; colors?: string[] }[]
  selectedItems: string[]
  maxItems?: number
  onToggle?: (itemId: string) => void
  onConfirm?: (itemIds: string[]) => void
}
