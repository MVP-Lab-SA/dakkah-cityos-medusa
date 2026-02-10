import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface RentalCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  pricePerDay: PriceData
  pricePerWeek?: PriceData
  pricePerMonth?: PriceData
  availableFrom?: string
  availableUntil?: string
  rating?: { average: number; count: number }
  location?: string
  deposit?: PriceData
  condition?: "new" | "like-new" | "good" | "fair"
  variant?: "default" | "compact" | "horizontal"
  onRent?: () => void
}

export interface RentalCalendarProps extends BaseComponentProps {
  productId: string
  availableDates: string[]
  bookedDates: string[]
  selectedRange?: { start: string; end: string }
  minDays?: number
  maxDays?: number
  onRangeSelect: (range: { start: string; end: string }) => void
}

export interface RentalAgreementViewProps extends BaseComponentProps {
  agreementId: string
  status: "pending" | "active" | "returned" | "overdue" | "cancelled"
  product: { id: string; title: string; thumbnail?: string }
  period: { start: string; end: string }
  totalPrice: PriceData
  deposit: PriceData
  terms?: string
}

export interface RentalReturnFormProps extends BaseComponentProps {
  agreementId: string
  onSubmit: (data: { condition: string; notes?: string; photos?: File[] }) => void
  onCancel: () => void
}

export interface DamageClaimProps extends BaseComponentProps {
  claimId: string
  status: "filed" | "reviewing" | "approved" | "denied"
  description: string
  amount?: PriceData
  photos?: string[]
}

export interface RentalPricingTableProps extends BaseComponentProps {
  daily: PriceData
  weekly?: PriceData
  monthly?: PriceData
  deposit?: PriceData
  insurance?: PriceData
  selectedDuration?: number
}
