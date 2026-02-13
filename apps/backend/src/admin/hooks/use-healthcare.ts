import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type HealthcarePractitioner = {
  id: string
  name: string
  title?: string | null
  specialization: string
  license_number?: string | null
  tenant_id: string
  bio?: string | null
  education?: any
  experience_years?: number | null
  languages?: any
  consultation_fee?: number | null
  currency_code?: string | null
  consultation_duration_minutes?: number
  is_accepting_patients?: boolean
  photo_url?: string | null
  availability?: any
  metadata?: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export function useHealthcarePractitioners() {
  return useQuery({
    queryKey: ["healthcare"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/healthcare", { method: "GET" })
      return response as { items: HealthcarePractitioner[]; count: number }
    },
  })
}

export function useCreateHealthcarePractitioner() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<HealthcarePractitioner>) => {
      const response = await sdk.client.fetch("/admin/healthcare", { method: "POST", body: data })
      return response as { item: HealthcarePractitioner }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["healthcare"] }),
  })
}
