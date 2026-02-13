import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type LegalAttorney = {
  id: string
  tenant_id: string
  user_id?: string
  name: string
  bar_number?: string
  specializations?: any
  practice_areas?: any
  bio?: string
  education?: any
  experience_years?: number
  hourly_rate?: number
  currency_code?: string
  is_accepting_cases?: boolean
  rating?: number
  photo_url?: string
  languages?: any
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useLegalAttorneys() {
  return useQuery({
    queryKey: ["legal"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/legal", { method: "GET" })
      return response as { items: LegalAttorney[]; count: number }
    },
  })
}

export function useCreateLegalAttorney() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<LegalAttorney>) => {
      const response = await sdk.client.fetch("/admin/legal", { method: "POST", body: data })
      return response as { item: LegalAttorney }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["legal"] }),
  })
}
