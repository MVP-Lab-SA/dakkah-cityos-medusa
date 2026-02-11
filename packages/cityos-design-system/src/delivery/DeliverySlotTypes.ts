import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface DeliverySlotPickerProps extends BaseComponentProps {
  availableDates: DeliveryDate[]
  selectedDateId?: string
  selectedSlotId?: string
  onDateSelect: (dateId: string) => void
  onSlotSelect: (slotId: string) => void
  variant?: "grid" | "list" | "calendar"
  locale?: string
}

export interface DeliveryDate {
  id: string
  date: string
  dayLabel: string
  available: boolean
  slots: DeliveryTimeSlot[]
}

export interface DeliveryTimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
  price?: PriceData
  label?: string
}

export interface TimeWindowSelectorProps extends BaseComponentProps {
  windows: TimeWindow[]
  selectedId?: string
  onSelect: (windowId: string) => void
  locale?: string
}

export interface TimeWindow {
  id: string
  label: string
  startTime: string
  endTime: string
  available: boolean
  icon?: string
}

export interface DeliveryCalendarProps extends BaseComponentProps {
  availableDates: DeliveryDate[]
  selectedDateId?: string
  onDateSelect: (dateId: string) => void
  month?: number
  year?: number
  onMonthChange?: (month: number, year: number) => void
  locale?: string
}

export interface DeliveryScheduleSummaryProps extends BaseComponentProps {
  date: string
  timeWindow: string
  deliveryType: string
  price?: PriceData
  address?: string
  onEdit?: () => void
  locale?: string
}
