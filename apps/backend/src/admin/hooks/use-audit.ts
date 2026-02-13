import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type AuditLog = {
  id: string
  timestamp: string
  actor: string
  action: string
  resource_type: string
  resource_id: string
  ip_address?: string
  user_agent?: string
  changes?: Record<string, unknown>
  metadata?: Record<string, unknown>
  created_at: string
}

export function useAuditLogs(params?: { actor?: string; action?: string; resource_type?: string; search?: string; date_from?: string; date_to?: string }) {
  return useQuery({
    queryKey: ["audit", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.actor) searchParams.set("actor", params.actor)
      if (params?.action) searchParams.set("action", params.action)
      if (params?.resource_type) searchParams.set("resource_type", params.resource_type)
      if (params?.search) searchParams.set("q", params.search)
      if (params?.date_from) searchParams.set("date_from", params.date_from)
      if (params?.date_to) searchParams.set("date_to", params.date_to)
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/audit${query ? `?${query}` : ""}`)
      return response as { audit_logs: AuditLog[] }
    },
  })
}
