import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type ParkingZone = {
  id: string
  tenant_id: string
  name: string
  description?: string
  zone_type: "street" | "garage" | "lot" | "valet" | "airport" | "reserved"
  address?: any
  latitude?: number
  longitude?: number
  total_spots: number
  available_spots: number
  hourly_rate?: number
  daily_rate?: number
  monthly_rate?: number
  currency_code: string
  operating_hours?: any
  is_active?: boolean
  has_ev_charging?: boolean
  has_disabled_spots?: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useParkingZones() {
  return useQuery({
    queryKey: ["parking"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/parking", { method: "GET" })
      return response as { items: ParkingZone[]; count: number }
    },
  })
}

export function useCreateParkingZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ParkingZone>) => {
      const response = await sdk.client.fetch("/admin/parking", { method: "POST", body: data })
      return response as { item: ParkingZone }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parking"] }),
  })
}
