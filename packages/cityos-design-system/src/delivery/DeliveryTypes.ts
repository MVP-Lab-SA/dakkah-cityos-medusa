import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface DeliverySlotPickerProps extends BaseComponentProps {
  availableSlots: DeliverySlot[]
  selectedSlotId?: string
  onSlotSelect: (slotId: string) => void
  variant?: "grid" | "list" | "calendar"
  showPrice?: boolean
}

export interface DeliverySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  price?: PriceData
  type?: "standard" | "express" | "same-day"
  capacity?: number
  remaining?: number
}

export interface TrackingMapProps extends BaseComponentProps {
  orderId: string
  driverLocation?: { lat: number; lng: number }
  destinationLocation: { lat: number; lng: number }
  pickupLocation?: { lat: number; lng: number }
  estimatedArrival?: string
  status: "preparing" | "picked-up" | "in-transit" | "nearby" | "delivered"
  polyline?: string
  height?: string
}

export interface TrackingTimelineProps extends BaseComponentProps {
  events: TrackingEvent[]
  currentStatus: string
  estimatedDelivery?: string
}

export interface TrackingEvent {
  id: string
  status: string
  description: string
  timestamp: string
  location?: string
  icon?: string
}

export interface ReturnRequestFormProps extends BaseComponentProps {
  orderId: string
  items: ReturnableItem[]
  reasons: string[]
  onSubmit: (data: ReturnRequestData) => void
  onCancel: () => void
}

export interface ReturnableItem {
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

export interface ExchangeSelectorProps extends BaseComponentProps {
  originalItem: ReturnableItem
  exchangeOptions: ExchangeOption[]
  onSelect: (optionId: string) => void
}

export interface ExchangeOption {
  id: string
  title: string
  variant: string
  thumbnail?: string
  priceDifference?: PriceData
  available: boolean
}

export interface StorePickupSelectorProps extends BaseComponentProps {
  stores: StoreLocation[]
  selectedStoreId?: string
  onStoreSelect: (storeId: string) => void
  showMap?: boolean
}

export interface StoreLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  distance?: string
  pickupAvailable: boolean
  pickupSlots?: DeliverySlot[]
  phone?: string
  hours?: string
}

export interface ExpressDeliveryBadgeProps extends BaseComponentProps {
  type: "same-day" | "express" | "next-day" | "scheduled"
  estimatedTime?: string
  surcharge?: PriceData
  size?: Size
}
