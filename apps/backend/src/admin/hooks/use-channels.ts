import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

export type Channel = {
  id: string
  name: string
  type: "web" | "mobile" | "pos" | "api" | "kiosk" | "social"
  status: "active" | "inactive" | "maintenance"
  tenant_id?: string
  tenant_name?: string
  description?: string
  configuration?: Record<string, unknown>
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useChannels(params?: { type?: string; status?: string; search?: string }) {
  return useQuery({
    queryKey: ["channels", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.type) searchParams.set("type", params.type)
      if (params?.status) searchParams.set("status", params.status)
      if (params?.search) searchParams.set("q", params.search)
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/channels${query ? `?${query}` : ""}`)
      return response as { channels: Channel[] }
    },
  })
}

export function useCreateChannel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Channel>) => {
      const response = await sdk.client.fetch(`/admin/channels`, {
        method: "POST",
        body: data,
      })
      return response as { channel: Channel }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] })
    },
  })
}

export function useUpdateChannel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Channel> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/channels/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { channel: Channel }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] })
    },
  })
}

export function useDeleteChannel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/channels/${id}`, {
        method: "DELETE",
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] })
    },
  })
}
