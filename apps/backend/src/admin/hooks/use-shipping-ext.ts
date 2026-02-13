import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type CarrierConfig = {
  id: string
  name: string
  carrier_code: string
  api_key?: string
  account_number?: string
  is_active: boolean
  supported_services: string[]
  default_service?: string
  weight_unit: "kg" | "lb"
  dimension_unit: "cm" | "in"
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ShippingRate = {
  id: string
  carrier_id: string
  name: string
  service_code: string
  zone?: string
  min_weight?: number
  max_weight?: number
  base_rate: number
  per_kg_rate?: number
  currency_code: string
  estimated_days_min?: number
  estimated_days_max?: number
  is_active: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useCarrierConfigs(params?: { is_active?: boolean }) {
  return useQuery({
    queryKey: ["carrier-configs", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.is_active !== undefined) searchParams.set("is_active", String(params.is_active))

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/shipping-ext/carriers${query ? `?${query}` : ""}`)
      return response as { carriers: CarrierConfig[] }
    },
  })
}

export function useShippingRates(params?: { carrier_id?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: ["shipping-rates", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.carrier_id) searchParams.set("carrier_id", params.carrier_id)
      if (params?.is_active !== undefined) searchParams.set("is_active", String(params.is_active))

      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/shipping-ext/rates${query ? `?${query}` : ""}`)
      return response as { rates: ShippingRate[] }
    },
  })
}

export function useCreateCarrierConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<CarrierConfig>) => {
      const response = await sdk.client.fetch(`/admin/shipping-ext/carriers`, {
        method: "POST",
        body: data,
      })
      return response as { carrier: CarrierConfig }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carrier-configs"] })
    },
  })
}
