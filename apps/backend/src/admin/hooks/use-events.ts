import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type EventTicketing = {
  id: string
  tenant_id: string
  title: string
  description?: string
  event_type: "concert" | "conference" | "workshop" | "sports" | "festival" | "webinar" | "meetup" | "other"
  venue_id?: string
  address?: any
  latitude?: number
  longitude?: number
  starts_at: string
  ends_at: string
  timezone?: string
  is_online?: boolean
  online_url?: string
  max_capacity?: number
  organizer_name?: string
  organizer_email?: string
  vendor_id?: string
  image_url?: string
  tags?: any
  status: "draft" | "published" | "live" | "completed" | "cancelled"
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/event-ticketing", { method: "GET" })
      return response as { items: EventTicketing[]; count: number }
    },
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<EventTicketing>) => {
      const response = await sdk.client.fetch("/admin/event-ticketing", { method: "POST", body: data })
      return response as { item: EventTicketing }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  })
}
