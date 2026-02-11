import type { BaseComponentProps } from "../components/ComponentTypes"

export interface BNPLProviderInfo {
  id: string
  name: string
  logo?: string
  installments: number
  interestRate: number
  monthlyPayment: number
  totalPayment: number
  currency: string
  eligible: boolean
  minAmount?: number
  maxAmount?: number
}

export interface BNPLSelectorProps extends BaseComponentProps {
  providers: BNPLProviderInfo[]
  orderTotal: number
  currency?: string
  selectedProviderId?: string
  onProviderSelect: (providerId: string) => void
  onEligibilityCheck?: () => void
  locale?: string
  loading?: boolean
}

export interface BNPLBadgeProps extends BaseComponentProps {
  providerName: string
  installments: number
  monthlyAmount: number
  currency?: string
  locale?: string
}

export interface InstallmentPreviewProps extends BaseComponentProps {
  installments: number
  monthlyAmount: number
  totalAmount: number
  interestRate: number
  currency?: string
  startDate?: string
  locale?: string
}

export interface BNPLProviderCardProps extends BaseComponentProps {
  provider: BNPLProviderInfo
  selected?: boolean
  onSelect?: (providerId: string) => void
  currency?: string
  locale?: string
}

export interface BNPLEligibilityProps extends BaseComponentProps {
  eligible: boolean
  reason?: string
  minAmount?: number
  maxAmount?: number
  currency?: string
  onCheck?: () => void
  locale?: string
  loading?: boolean
}
