import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface WalletBalanceProps extends BaseComponentProps {
  balance: PriceData
  pendingBalance?: PriceData
  lastUpdated?: string
  size?: Size
  showTopUp?: boolean
  onTopUp?: () => void
}

export interface WalletTransactionProps extends BaseComponentProps {
  transactions: WalletTransaction[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export interface WalletTransaction {
  id: string
  type: "credit" | "debit" | "transfer" | "refund" | "top-up"
  amount: PriceData
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  counterparty?: string
  reference?: string
}

export interface BNPLSelectorProps extends BaseComponentProps {
  providers: BNPLProvider[]
  orderTotal: PriceData
  selectedProviderId?: string
  onProviderSelect: (providerId: string) => void
  onEligibilityCheck?: () => void
}

export interface BNPLProvider {
  id: string
  name: string
  logo?: string
  installments: number
  interestRate: number
  monthlyPayment: PriceData
  totalPayment: PriceData
  eligible: boolean
  minAmount?: PriceData
  maxAmount?: PriceData
}

export interface InstallmentPickerProps extends BaseComponentProps {
  total: PriceData
  plans: InstallmentPlan[]
  selectedPlanId?: string
  onPlanSelect: (planId: string) => void
}

export interface InstallmentPlan {
  id: string
  installments: number
  monthlyAmount: PriceData
  totalAmount: PriceData
  interestRate: number
  processingFee?: PriceData
  firstPaymentDate?: string
}

export interface StoreCreditWidgetProps extends BaseComponentProps {
  balance: PriceData
  appliedAmount?: PriceData
  onApply?: (amount: number) => void
  onRemove?: () => void
  maxApplicable?: PriceData
}

export interface EscrowStatusProps extends BaseComponentProps {
  escrowId: string
  amount: PriceData
  status: "held" | "released" | "disputed" | "refunded"
  heldSince?: string
  releaseDate?: string
  parties: { buyer: string; seller: string }
}

export interface DisputeFormProps extends BaseComponentProps {
  orderId: string
  reasons: string[]
  onSubmit: (data: { reason: string; description: string; evidence?: File[] }) => void
  onCancel: () => void
}

export interface RefundStatusProps extends BaseComponentProps {
  refundId: string
  amount: PriceData
  status: "requested" | "processing" | "completed" | "denied"
  method: "original" | "store-credit" | "wallet"
  requestedAt: string
  completedAt?: string
  timeline?: { status: string; timestamp: string }[]
}

export interface GiftCardProps extends BaseComponentProps {
  code?: string
  balance: PriceData
  originalAmount: PriceData
  expiresAt?: string
  status: "active" | "redeemed" | "expired" | "disabled"
  recipientEmail?: string
  senderName?: string
  message?: string
}

export interface GiftCardPurchaseFormProps extends BaseComponentProps {
  amounts: number[]
  customAmount?: boolean
  currencyCode: string
  onPurchase: (data: { amount: number; recipientEmail: string; message?: string }) => void
}
