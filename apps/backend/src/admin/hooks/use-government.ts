import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type GovernmentService = {
  id: string
  tenant_id: string
  citizen_id: string
  request_type: "maintenance" | "complaint" | "inquiry" | "permit" | "license" | "inspection" | "emergency"
  category?: string
  title: string
  description: string
  location?: any
  status?: "submitted" | "acknowledged" | "in_progress" | "resolved" | "closed" | "rejected"
  priority?: "low" | "medium" | "high" | "urgent"
  assigned_to?: string
  department?: string
  resolution?: string
  resolved_at?: string
  photos?: any
  reference_number: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useGovernmentServices() {
  return useQuery({
    queryKey: ["government"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/government", { method: "GET" })
      return response as { items: GovernmentService[]; count: number }
    },
  })
}

export function useCreateGovernmentService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<GovernmentService>) => {
      const response = await sdk.client.fetch("/admin/government", { method: "POST", body: data })
      return response as { item: GovernmentService }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["government"] }),
  })
}
