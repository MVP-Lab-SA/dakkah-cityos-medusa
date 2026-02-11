import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

export type GovernancePolicy = {
  id: string
  name: string
  scope: "global" | "tenant" | "node" | "channel" | "product"
  authority_level: string
  status: "active" | "inactive" | "draft"
  priority: number
  rules?: Record<string, unknown>
  description?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useGovernancePolicies(params?: { scope?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ["governance", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.scope) searchParams.set("scope", params.scope)
      if (params?.status) searchParams.set("status", params.status)
      if (params?.search) searchParams.set("q", params.search)
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/governance${query ? `?${query}` : ""}`)
      return response as { policies: GovernancePolicy[] }
    },
  })
}

export function useCreateGovernancePolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<GovernancePolicy>) => {
      const response = await sdk.client.fetch(`/admin/governance`, {
        method: "POST",
        body: data,
      })
      return response as { policy: GovernancePolicy }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governance"] })
    },
  })
}

export function useUpdateGovernancePolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<GovernancePolicy> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/governance/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { policy: GovernancePolicy }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governance"] })
    },
  })
}

export function useDeleteGovernancePolicy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/governance/${id}`, {
        method: "DELETE",
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governance"] })
    },
  })
}
