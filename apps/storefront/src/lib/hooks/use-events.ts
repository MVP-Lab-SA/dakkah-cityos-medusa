import { useQuery } from "@tanstack/react-query"
import { normalizeItem } from "@/lib/utils/normalize-item"

async function fetchEvents(filters?: Record<string, unknown>) {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value))
      }
    })
  }
  const queryStr = params.toString()
  const url = `/store/events${queryStr ? `?${queryStr}` : ""}`

  const isServer = typeof window === "undefined"
  const baseUrl = isServer ? (import.meta.env?.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000") : ""
  const fullUrl = `${baseUrl}${url}`

  const resp = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": import.meta.env?.VITE_MEDUSA_PUBLISHABLE_KEY || "",
    },
  })
  if (!resp.ok) throw new Error(`Events API error: ${resp.status}`)
  const data = await resp.json()
  return data?.items || []
}

export function useEvents(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => fetchEvents(filters),
    staleTime: 30000,
    retry: 1,
  })
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const isServer = typeof window === "undefined"
      const baseUrl = isServer ? (import.meta.env?.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000") : ""
      const resp = await fetch(`${baseUrl}/store/events/${eventId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": import.meta.env?.VITE_MEDUSA_PUBLISHABLE_KEY || "",
        },
      })
      if (!resp.ok) throw new Error(`Event API error: ${resp.status}`)
      const data = await resp.json()
      return normalizeItem(data)
    },
    enabled: !!eventId,
  })
}
