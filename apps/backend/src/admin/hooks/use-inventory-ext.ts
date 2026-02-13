import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type StockAlert = {
  id: string
  product_id: string
  variant_id?: string
  alert_type: "low_stock" | "out_of_stock" | "overstock"
  threshold: number
  current_quantity: number
  is_resolved: boolean
  product?: {
    id: string
    title: string
    thumbnail?: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type WarehouseTransfer = {
  id: string
  from_warehouse_id: string
  to_warehouse_id: string
  status: "pending" | "in_transit" | "completed" | "canceled"
  items: {
    product_id: string
    variant_id?: string
    quantity: number
  }[]
  initiated_by?: string
  completed_at?: string
  notes?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ReservationHold = {
  id: string
  product_id: string
  variant_id?: string
  quantity: number
  order_id?: string
  customer_id?: string
  expires_at: string
  status: "active" | "released" | "converted" | "expired"
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useStockAlerts(params?: { alert_type?: string; is_resolved?: boolean }) {
  return useQuery({
    queryKey: ["stock-alerts", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.alert_type) searchParams.set("alert_type", params.alert_type)
      if (params?.is_resolved !== undefined) searchParams.set("is_resolved", String(params.is_resolved))

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/inventory-ext/stock-alerts${query ? `?${query}` : ""}`)
      return response as { alerts: StockAlert[] }
    },
  })
}

export function useWarehouseTransfers(params?: { status?: string }) {
  return useQuery({
    queryKey: ["warehouse-transfers", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/inventory-ext/transfers${query ? `?${query}` : ""}`)
      return response as { transfers: WarehouseTransfer[] }
    },
  })
}

export function useReservationHolds(params?: { status?: string; product_id?: string }) {
  return useQuery({
    queryKey: ["reservation-holds", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.product_id) searchParams.set("product_id", params.product_id)

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/inventory-ext/reservations${query ? `?${query}` : ""}`)
      return response as { reservations: ReservationHold[] }
    },
  })
}
