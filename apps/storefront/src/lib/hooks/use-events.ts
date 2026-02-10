import { useQuery } from "@tanstack/react-query"

export function useEvents(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => [] as any[],
    placeholderData: [],
  })
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => null as any,
    enabled: !!eventId,
  })
}
