import type { BaseComponentProps } from "../components/ComponentTypes"

export interface OrderTrackingMapProps extends BaseComponentProps {
  orderId: string
  driverLocation?: { lat: number; lng: number }
  destinationLocation: { lat: number; lng: number }
  pickupLocation?: { lat: number; lng: number }
  estimatedArrival?: string
  status: "preparing" | "picked-up" | "in-transit" | "nearby" | "delivered"
  polyline?: string
  height?: string
  locale?: string
}

export interface TrackingTimelineProps extends BaseComponentProps {
  events: TrackingEventInfo[]
  currentStatus: string
  estimatedDelivery?: string
  locale?: string
}

export interface TrackingEventInfo {
  id: string
  status: string
  description: string
  timestamp: string
  location?: string
  icon?: string
  completed: boolean
}

export interface DeliveryETAProps extends BaseComponentProps {
  estimatedTime: string
  status: "on-time" | "delayed" | "early" | "delivered"
  updatedAt?: string
  locale?: string
}

export interface DriverInfoCardProps extends BaseComponentProps {
  name: string
  photo?: string
  phone?: string
  rating?: number
  vehicleType?: string
  vehiclePlate?: string
  onCall?: () => void
  onMessage?: () => void
  locale?: string
}

export interface DriverInfoProps extends BaseComponentProps {
  name: string
  photo?: string
  phone?: string
  onContact?: () => void
  locale?: string
}

export interface ETADisplayProps extends BaseComponentProps {
  estimatedTime: string
  status: "on-time" | "delayed" | "early" | "delivered"
  countdown?: boolean
  updatedAt?: string
  locale?: string
}
