import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface ExpressDeliveryBadgeProps extends BaseComponentProps {
  type: "same-day" | "express" | "next-day" | "scheduled"
  estimatedTime?: string
  surcharge?: PriceData
  size?: Size
  locale?: string
}

export interface ExpressDeliveryBannerProps extends BaseComponentProps {
  title?: string
  description?: string
  cutoffTime?: string
  deliveryType: "same-day" | "express" | "next-day"
  zipCode?: string
  onCheckAvailability?: (zipCode: string) => void
  available?: boolean
  locale?: string
}

export interface DeliverySpeedSelectorProps extends BaseComponentProps {
  options: DeliverySpeedOption[]
  selectedId?: string
  onSelect: (optionId: string) => void
  locale?: string
}

export interface DeliverySpeedOption {
  id: string
  type: "standard" | "express" | "same-day" | "next-day" | "scheduled"
  label: string
  estimatedTime: string
  price: PriceData
  available: boolean
  cutoffTime?: string
}

export interface ExpressDeliveryOptionsProps extends BaseComponentProps {
  options: DeliverySpeedOption[]
  selectedId?: string
  onSelect: (optionId: string) => void
  showPrices?: boolean
  locale?: string
}

export interface PriorityFulfillmentProps extends BaseComponentProps {
  priority: "standard" | "high" | "urgent"
  estimatedTime?: string
  description?: string
  locale?: string
}
