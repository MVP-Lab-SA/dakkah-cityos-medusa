import type { BaseComponentProps } from "../components/ComponentTypes"

export interface GiftCardDesign {
  id: string
  name: string
  category: "birthday" | "holiday" | "thank-you" | "celebration" | "general"
  imageUrl?: string
  colors: { primary: string; secondary: string }
}

export interface GiftCardDesignPickerProps extends BaseComponentProps {
  designs: GiftCardDesign[]
  selectedDesignId?: string
  onSelect: (designId: string) => void
  locale?: string
}

export interface GiftCardAmountSelectorProps extends BaseComponentProps {
  presetAmounts: number[]
  selectedAmount?: number
  customAmount?: number
  currencyCode?: string
  minAmount?: number
  maxAmount?: number
  onAmountChange: (amount: number) => void
  locale?: string
}

export interface GiftCardMessageFormProps extends BaseComponentProps {
  recipientEmail?: string
  recipientName?: string
  senderName?: string
  message?: string
  deliveryDate?: string
  onFieldChange: (field: string, value: string) => void
  onSubmit: () => void
  loading?: boolean
  locale?: string
}

export interface GiftCardTransaction {
  id: string
  type: "purchase" | "redemption" | "refund"
  amount: number
  date: string
  description: string
}

export interface GiftCardBalanceProps extends BaseComponentProps {
  balance: number
  originalAmount: number
  currencyCode?: string
  code: string
  expiresAt?: string
  status: "active" | "redeemed" | "expired" | "disabled"
  transactions?: GiftCardTransaction[]
  locale?: string
}

export interface GiftCardRedeemProps extends BaseComponentProps {
  onRedeem: (code: string) => void
  loading?: boolean
  error?: string
  success?: boolean
  locale?: string
}
