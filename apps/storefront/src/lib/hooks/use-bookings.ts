import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../utils/sdk"
import type {
  Service,
  ServiceProvider,
  TimeSlot,
  Booking,
  BookingRequest,
} from "../types/bookings"

// Query Keys
export const bookingKeys = {
  all: ["bookings"] as const,
  services: () => [...bookingKeys.all, "services"] as const,
  service: (id: string) => [...bookingKeys.services(), id] as const,
  providers: () => [...bookingKeys.all, "providers"] as const,
  provider: (id: string) => [...bookingKeys.providers(), id] as const,
  availability: (serviceId: string, date: string) =>
    [...bookingKeys.all, "availability", serviceId, date] as const,
  list: () => [...bookingKeys.all, "list"] as const,
  detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await sdk.client.fetch<T>(path, {
    method: options?.method || "GET",
    body: options?.body,
  })
  return response as T
}

function normalizeService(raw: any): Service {
  const meta = typeof raw.metadata === "string"
    ? JSON.parse(raw.metadata)
    : raw.metadata || {}
  return {
    id: raw.id,
    name: raw.name || meta.name || "Untitled Service",
    handle: raw.handle || raw.product_id || raw.id,
    description: raw.description || meta.description || meta.short_description || "",
    duration: raw.duration ?? raw.duration_minutes ?? meta.duration ?? 60,
    buffer_time: raw.buffer_time ?? raw.buffer_before_minutes ?? 0,
    price: raw.price ?? meta.price ?? 0,
    currency_code: raw.currency_code || meta.currency_code || meta.currency || "USD",
    capacity: raw.capacity ?? raw.max_capacity ?? meta.capacity ?? 1,
    category_id: raw.category_id || meta.category || undefined,
    providers: raw.providers || [],
    images: raw.images || (meta.images ? meta.images.map((url: string) => ({ url })) : []),
    metadata: meta,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  }
}

// Hooks - Services
export function useServices() {
  return useQuery({
    queryKey: bookingKeys.services(),
    queryFn: async () => {
      const response = await fetchApi<{ services: any[] }>("/store/bookings/services")
      return (response.services || []).map(normalizeService)
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useService(serviceId: string) {
  const { data: services, isLoading: servicesLoading } = useServices()
  
  const query = useQuery({
    queryKey: bookingKeys.service(serviceId),
    queryFn: async () => {
      return services?.find(
        (s) => s.id === serviceId || s.handle === serviceId
      ) || null
    },
    enabled: !!serviceId && !!services,
  })

  return {
    ...query,
    isLoading: servicesLoading || query.isLoading,
  }
}

// Hooks - Availability
export function useServiceAvailability(
  serviceId: string,
  date: string,
  providerId?: string
) {
  return useQuery({
    queryKey: bookingKeys.availability(serviceId, date),
    queryFn: async () => {
      const params = new URLSearchParams({
        service_id: serviceId,
        date,
        ...(providerId && { provider_id: providerId }),
      })
      
      const response = await fetchApi<{
        available_slots: Array<{
          start_time: string
          end_time: string
          provider_id?: string
          duration_minutes: number
        }>
        service: { id: string; name: string; duration_minutes: number; price: number }
      }>(`/store/bookings/availability?${params}`)
      
      // Transform to TimeSlot format
      return response.available_slots.map(slot => ({
        start: slot.start_time,
        end: slot.end_time,
        provider_id: slot.provider_id,
        available: true,
        capacity_remaining: 1,
      })) as TimeSlot[]
    },
    enabled: !!serviceId && !!date,
  })
}

// Legacy alias for compatibility
export function useProviderAvailability(
  providerId: string,
  date: string,
  duration?: number
) {
  // Note: This is now service-based, not provider-based
  // For backward compatibility, we'll still accept providerId but fetch by service
  return useQuery({
    queryKey: bookingKeys.availability(providerId, date),
    queryFn: async () => {
      // Return empty array since we need service_id now
      console.warn("useProviderAvailability is deprecated. Use useServiceAvailability instead.")
      return [] as TimeSlot[]
    },
    enabled: !!providerId && !!date,
  })
}

// Hooks - Customer Bookings
export function useCustomerBookings() {
  return useQuery({
    queryKey: bookingKeys.list(),
    queryFn: async () => {
      const response = await fetchApi<{ bookings: Booking[] }>("/store/bookings")
      return response.bookings
    },
  })
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: async () => {
      const response = await fetchApi<{ booking: Booking }>(`/store/bookings/${bookingId}`)
      return response.booking
    },
    enabled: !!bookingId,
  })
}

// Mutations
export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BookingRequest) => {
      const response = await fetchApi<{ booking: Booking }>("/store/bookings", {
        method: "POST",
        body: JSON.stringify({
          service_id: data.service_id,
          provider_id: data.provider_id,
          start_time: data.start_time,
          attendee_count: data.attendees || 1,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          customer_notes: data.notes,
        }),
      })
      return response.booking
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() })
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      bookingId,
      reason,
    }: {
      bookingId: string
      reason?: string
    }) => {
      const response = await fetchApi<{ booking: Booking }>(`/store/bookings/${bookingId}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      })
      return response.booking
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) })
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() })
    },
  })
}

export function useRescheduleBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      bookingId,
      newStartTime,
      newProviderId,
    }: {
      bookingId: string
      newStartTime: string
      newProviderId?: string
    }) => {
      const response = await fetchApi<{ booking: Booking }>(`/store/bookings/${bookingId}/reschedule`, {
        method: "POST",
        body: JSON.stringify({
          new_start_time: newStartTime,
          new_provider_id: newProviderId,
        }),
      })
      return response.booking
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) })
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() })
    },
  })
}

// Service providers hook - fetches providers for a specific service
export function useServiceProviders(serviceId?: string) {
  return useQuery({
    queryKey: [...bookingKeys.providers(), serviceId],
    queryFn: async () => {
      if (!serviceId) return [] as ServiceProvider[]
      
      const response = await fetchApi<{ 
        providers: ServiceProvider[]
        count: number 
      }>(`/store/bookings/services/${serviceId}/providers`)
      
      return response.providers
    },
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
  })
}
