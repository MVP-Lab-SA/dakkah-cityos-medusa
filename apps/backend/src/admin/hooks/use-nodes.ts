import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type NodeType = {
  id: string
  name: string
  type: "CITY" | "DISTRICT" | "ZONE" | "FACILITY" | "ASSET"
  parent_id?: string
  parent?: NodeType
  tenant_id?: string
  tenant_name?: string
  description?: string
  status: "active" | "inactive" | "maintenance"
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useNodes(params?: { type?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ["nodes", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.type) searchParams.set("type", params.type)
      if (params?.status) searchParams.set("status", params.status)
      if (params?.search) searchParams.set("q", params.search)
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/nodes${query ? `?${query}` : ""}`)
      return response as { nodes: NodeType[] }
    },
  })
}

export function useCreateNode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<NodeType>) => {
      const response = await sdk.client.fetch(`/admin/nodes`, {
        method: "POST",
        body: data,
      })
      return response as { node: NodeType }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] })
    },
  })
}

export function useUpdateNode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<NodeType> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/nodes/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { node: NodeType }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] })
    },
  })
}

export function useDeleteNode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/nodes/${id}`, {
        method: "DELETE",
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nodes"] })
    },
  })
}
