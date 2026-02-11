import type { BaseComponentProps } from "../components/ComponentTypes"

export interface StorePickupSelectorProps extends BaseComponentProps {
  stores: StoreLocationInfo[]
  selectedStoreId?: string
  onStoreSelect: (storeId: string) => void
  showMap?: boolean
  locale?: string
}

export interface StoreLocationInfo {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  distance?: string
  pickupAvailable: boolean
  phone?: string
  hours?: string
  stockStatus?: "in-stock" | "low-stock" | "out-of-stock"
}

export interface PickupSchedulerProps extends BaseComponentProps {
  storeId: string
  availableSlots: PickupSlot[]
  selectedSlotId?: string
  onSlotSelect: (slotId: string) => void
  locale?: string
}

export interface PickupSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  capacity?: number
  remaining?: number
}

export interface StoreAvailabilityCardProps extends BaseComponentProps {
  store: StoreLocationInfo
  isSelected?: boolean
  onSelect?: (storeId: string) => void
  locale?: string
}

export interface StoreCardProps extends BaseComponentProps {
  store: StoreLocationInfo
  isSelected?: boolean
  onSelect?: (storeId: string) => void
  showDistance?: boolean
  showHours?: boolean
  locale?: string
}
