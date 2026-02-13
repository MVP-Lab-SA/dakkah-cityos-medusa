import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type RegionZone = {
  id: string
  name: string
  zone_code: "GCC_EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"
  countries: string[]
  data_residency?: Record<string, unknown>
  status: "active" | "inactive"
  description?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useRegionZones(params?: { zone_code?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ["region-zones", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.zone_code) searchParams.set("zone_code", params.zone_code)
      if (params?.status) searchParams.set("status", params.status)
      if (params?.search) searchParams.set("q", params.search)
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/region-zones${query ? `?${query}` : ""}`)
      return response as { region_zones: RegionZone[] }
    },
  })
}

export function useCreateRegionZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<RegionZone>) => {
      const response = await sdk.client.fetch(`/admin/region-zones`, {
        method: "POST",
        body: data,
      })
      return response as { region_zone: RegionZone }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-zones"] })
    },
  })
}

export function useUpdateRegionZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<RegionZone> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/region-zones/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { region_zone: RegionZone }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-zones"] })
    },
  })
}

export function useDeleteRegionZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/region-zones/${id}`, {
        method: "DELETE",
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-zones"] })
    },
  })
}
