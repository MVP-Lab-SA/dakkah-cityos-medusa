import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface ReturnRequestFormProps extends BaseComponentProps {
  orderId: string
  items: ReturnableItemInfo[]
  reasons: string[]
  onSubmit: (data: ReturnRequestData) => void
  onCancel: () => void
  locale?: string
}

export interface ReturnableItemInfo {
  id: string
  title: string
  thumbnail?: string
  quantity: number
  maxReturnQuantity: number
  price: PriceData
}

export interface ReturnRequestData {
  items: { itemId: string; quantity: number; reason: string }[]
  notes?: string
  preferRefund?: "original" | "store-credit"
  photos?: File[]
}

export interface ReturnLabelProps extends BaseComponentProps {
  trackingNumber: string
  carrier: string
  fromAddress: ReturnAddress
  toAddress: ReturnAddress
  barcode?: string
  onPrint?: () => void
  locale?: string
}

export interface ReturnAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface ExchangeSelectorProps extends BaseComponentProps {
  originalItem: ReturnableItemInfo
  exchangeOptions: ExchangeOptionInfo[]
  selectedOptionId?: string
  onSelect: (optionId: string) => void
  locale?: string
}

export interface ExchangeOptionInfo {
  id: string
  title: string
  variant: string
  thumbnail?: string
  priceDifference?: PriceData
  available: boolean
}

export interface ReturnStatusTrackerProps extends BaseComponentProps {
  returnId: string
  status: "initiated" | "label-generated" | "shipped" | "received" | "inspected" | "refunded"
  events: ReturnTrackingEvent[]
  refundAmount?: PriceData
  refundMethod?: string
  locale?: string
}

export interface ReturnTrackingEvent {
  id: string
  status: string
  description: string
  timestamp: string
  completed: boolean
}

export interface ReturnsCenterProps extends BaseComponentProps {
  returns: ReturnSummary[]
  onViewReturn: (returnId: string) => void
  onStartReturn?: () => void
  locale?: string
}

export interface ReturnSummary {
  id: string
  orderId: string
  status: "initiated" | "shipped" | "received" | "refunded" | "rejected"
  itemCount: number
  refundAmount?: PriceData
  createdAt: string
  updatedAt: string
}

export interface ReturnStatusProps extends BaseComponentProps {
  returnId: string
  status: "initiated" | "label-generated" | "shipped" | "received" | "inspected" | "refunded"
  events: ReturnTrackingEvent[]
  refundAmount?: PriceData
  refundMethod?: string
  locale?: string
}

export interface ReturnReasonSelectorProps extends BaseComponentProps {
  reasons: string[]
  selectedReason?: string
  onSelect: (reason: string) => void
  otherDetails?: string
  onOtherDetailsChange?: (details: string) => void
  locale?: string
}
