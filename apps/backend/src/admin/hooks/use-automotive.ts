import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type VehicleListing = {
  id: string
  tenant_id: string
  seller_id: string
  listing_type: "sale" | "lease" | "auction"
  title: string
  make: string
  model_name: string
  year: number
  mileage_km?: number
  fuel_type?: "petrol" | "diesel" | "electric" | "hybrid" | "hydrogen"
  transmission?: "automatic" | "manual" | "cvt"
  body_type?: "sedan" | "suv" | "hatchback" | "truck" | "van" | "coupe" | "convertible" | "wagon"
  color?: string
  vin?: string
  condition?: "new" | "certified_pre_owned" | "used" | "salvage"
  price: number
  currency_code: string
  description?: string
  features?: any
  images?: any
  location_city?: string
  location_country?: string
  status: "draft" | "active" | "reserved" | "sold" | "withdrawn"
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useAutomotive() {
  return useQuery({
    queryKey: ["automotive"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/automotive", { method: "GET" })
      return response as { items: VehicleListing[]; count: number }
    },
  })
}

export function useCreateVehicleListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<VehicleListing>) => {
      const response = await sdk.client.fetch("/admin/automotive", { method: "POST", body: data })
      return response as { item: VehicleListing }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["automotive"] }),
  })
}
