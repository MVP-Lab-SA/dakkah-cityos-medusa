import { useQuery } from "@tanstack/react-query"
import { getBackendUrl } from "@/lib/utils/env"

interface DeliverySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  price?: { amount: number; currency: string }
  type?: "standard" | "express" | "same-day"
  capacity?: number
  remaining?: number
}

interface TrackingEvent {
  id: string
  status: string
  description: string
  timestamp: string
  location?: string
}

interface StoreLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  distance?: string
  pickupAvailable: boolean
  phone?: string
  hours?: string
}

async function fetchApi<T>(path: string): Promise<T> {
  const baseUrl = getBackendUrl()
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || "Request failed")
  }

  return response.json()
}

export const deliveryKeys = {
  all: ["delivery"] as const,
  slots: (orderId: string) => [...deliveryKeys.all, "slots", orderId] as const,
  tracking: (orderId: string) => [...deliveryKeys.all, "tracking", orderId] as const,
  stores: () => [...deliveryKeys.all, "stores"] as const,
}

export function useDeliverySlots(orderId: string) {
  return useQuery({
    queryKey: deliveryKeys.slots(orderId),
    queryFn: async () => {
      const response = await fetchApi<{ slots: DeliverySlot[] }>(
        `/store/orders/${orderId}/delivery-slots`
      )
      return response.slots
    },
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useOrderTracking(orderId: string) {
  return useQuery({
    queryKey: deliveryKeys.tracking(orderId),
    queryFn: async () => {
      const response = await fetchApi<{
        events: TrackingEvent[]
        currentStatus: string
        estimatedDelivery?: string
        carrier?: string
        trackingNumber?: string
        pickupLocation?: { lat: number; lng: number }
        destinationLocation?: { lat: number; lng: number }
        driverLocation?: { lat: number; lng: number }
      }>(`/store/orders/${orderId}/tracking`)
      return response
    },
    enabled: !!orderId,
    refetchInterval: 30000,
  })
}

export function useStoreLocations() {
  return useQuery({
    queryKey: deliveryKeys.stores(),
    queryFn: async () => {
      const response = await fetchApi<{ stores: StoreLocation[] }>(
        `/store/stores`
      )
      return response.stores
    },
    staleTime: 10 * 60 * 1000,
  })
}
