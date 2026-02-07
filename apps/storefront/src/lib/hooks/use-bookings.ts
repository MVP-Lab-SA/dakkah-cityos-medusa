import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
  availability: (providerId: string, date: string) =>
    [...bookingKeys.all, "availability", providerId, date] as const,
  list: () => [...bookingKeys.all, "list"] as const,
  detail: (id: string) => [...bookingKeys.all, "detail", id] as const,
}

// Mock data
const mockServices: Service[] = [
  {
    id: "svc_consultation",
    name: "Business Consultation",
    handle: "business-consultation",
    description:
      "One-on-one consultation with our business experts to discuss strategy, growth, and optimization.",
    duration: 60,
    buffer_time: 15,
    price: 150,
    currency_code: "usd",
    capacity: 1,
    providers: [],
    images: [
      {
        url: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400",
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "svc_training",
    name: "Platform Training",
    handle: "platform-training",
    description:
      "Comprehensive training session to help your team master our platform features and best practices.",
    duration: 90,
    buffer_time: 30,
    price: 299,
    currency_code: "usd",
    capacity: 5,
    providers: [],
    images: [
      { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400" },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "svc_support",
    name: "Priority Support Call",
    handle: "priority-support",
    description:
      "Dedicated support session for urgent issues or complex technical problems.",
    duration: 30,
    buffer_time: 10,
    price: 75,
    currency_code: "usd",
    capacity: 1,
    providers: [],
    images: [
      { url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400" },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "svc_onboarding",
    name: "Enterprise Onboarding",
    handle: "enterprise-onboarding",
    description:
      "Comprehensive onboarding program for enterprise customers, including setup, training, and strategy.",
    duration: 120,
    buffer_time: 30,
    price: 500,
    currency_code: "usd",
    capacity: 10,
    providers: [],
    images: [
      { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400" },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockProviders: ServiceProvider[] = [
  {
    id: "prov_1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    bio: "Senior Business Consultant with 10+ years of enterprise experience.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    services: ["svc_consultation", "svc_onboarding"],
    rating: 4.9,
    review_count: 127,
    availability: {
      timezone: "America/New_York",
      weekly_schedule: {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "15:00" },
        saturday: null,
        sunday: null,
      },
      exceptions: [],
    },
  },
  {
    id: "prov_2",
    name: "Michael Chen",
    email: "michael@example.com",
    bio: "Technical Lead specializing in platform training and technical support.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    services: ["svc_training", "svc_support"],
    rating: 4.8,
    review_count: 89,
    availability: {
      timezone: "America/Los_Angeles",
      weekly_schedule: {
        monday: { start: "08:00", end: "16:00" },
        tuesday: { start: "08:00", end: "16:00" },
        wednesday: { start: "08:00", end: "16:00" },
        thursday: { start: "08:00", end: "16:00" },
        friday: { start: "08:00", end: "14:00" },
        saturday: null,
        sunday: null,
      },
      exceptions: [],
    },
  },
  {
    id: "prov_3",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    bio: "Customer Success Manager helping businesses achieve their goals.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    services: ["svc_consultation", "svc_support", "svc_onboarding"],
    rating: 5.0,
    review_count: 64,
    availability: {
      timezone: "America/Chicago",
      weekly_schedule: {
        monday: { start: "10:00", end: "18:00" },
        tuesday: { start: "10:00", end: "18:00" },
        wednesday: { start: "10:00", end: "18:00" },
        thursday: { start: "10:00", end: "18:00" },
        friday: { start: "10:00", end: "16:00" },
        saturday: { start: "10:00", end: "14:00" },
        sunday: null,
      },
      exceptions: [],
    },
  },
]

const mockBookings: Booking[] = []

// Generate time slots for a given date
function generateTimeSlots(
  providerId: string,
  date: string,
  duration: number = 60
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const provider = mockProviders.find((p) => p.id === providerId)
  if (!provider) return slots

  const dayOfWeek = new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof typeof provider.availability.weekly_schedule

  const schedule = provider.availability.weekly_schedule[dayOfWeek]
  if (!schedule) return slots

  const [startHour] = schedule.start.split(":").map(Number)
  const [endHour] = schedule.end.split(":").map(Number)

  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = new Date(`${date}T${hour.toString().padStart(2, "0")}:00:00`)
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000)

    // Check if slot is in the past
    const now = new Date()
    if (startTime < now) continue

    // Randomly mark some slots as unavailable for demo
    const available = Math.random() > 0.3

    slots.push({
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      provider_id: providerId,
      available,
      capacity_remaining: available ? Math.floor(Math.random() * 3) + 1 : 0,
    })
  }

  return slots
}

// Hooks
export function useServices() {
  return useQuery({
    queryKey: bookingKeys.services(),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch("/store/services")
      // return response.services

      return mockServices
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useService(serviceId: string) {
  return useQuery({
    queryKey: bookingKeys.service(serviceId),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch(`/store/services/${serviceId}`)
      // return response.service

      return mockServices.find(
        (s) => s.id === serviceId || s.handle === serviceId
      )
    },
    enabled: !!serviceId,
  })
}

export function useServiceProviders(serviceId?: string) {
  return useQuery({
    queryKey: bookingKeys.providers(),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch("/store/service-providers", {
      //   query: serviceId ? { service_id: serviceId } : {},
      // })
      // return response.providers

      if (serviceId) {
        return mockProviders.filter((p) => p.services.includes(serviceId))
      }
      return mockProviders
    },
  })
}

export function useProviderAvailability(
  providerId: string,
  date: string,
  duration?: number
) {
  return useQuery({
    queryKey: bookingKeys.availability(providerId, date),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch(`/store/providers/${providerId}/availability`, {
      //   query: { date, duration },
      // })
      // return response.slots

      return generateTimeSlots(providerId, date, duration)
    },
    enabled: !!providerId && !!date,
  })
}

export function useCustomerBookings() {
  return useQuery({
    queryKey: bookingKeys.list(),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch("/store/customers/me/bookings")
      // return response.bookings

      return mockBookings
    },
  })
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: async () => {
      // In production:
      // const response = await sdk.client.fetch(`/store/bookings/${bookingId}`)
      // return response.booking

      return mockBookings.find((b) => b.id === bookingId)
    },
    enabled: !!bookingId,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BookingRequest) => {
      // In production:
      // const response = await sdk.client.fetch("/store/bookings", {
      //   method: "POST",
      //   body: data,
      // })
      // return response.booking

      const service = mockServices.find((s) => s.id === data.service_id)
      const provider = mockProviders.find((p) => p.id === data.provider_id)

      const newBooking: Booking = {
        id: `book_${Date.now()}`,
        customer_id: "customer_123",
        service_id: data.service_id,
        service,
        provider_id: data.provider_id,
        provider,
        status: "confirmed",
        start_time: data.start_time,
        end_time: new Date(
          new Date(data.start_time).getTime() + (service?.duration || 60) * 60 * 1000
        ).toISOString(),
        notes: data.notes,
        attendees: data.attendees || 1,
        price: service?.price || 0,
        currency_code: service?.currency_code || "usd",
        payment_status: "paid",
        confirmation_code: `BOOK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockBookings.push(newBooking)
      return newBooking
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
      // In production:
      // const response = await sdk.client.fetch(`/store/bookings/${bookingId}/cancel`, {
      //   method: "POST",
      //   body: { reason },
      // })
      // return response.booking

      const booking = mockBookings.find((b) => b.id === bookingId)
      if (booking) {
        booking.status = "canceled"
        booking.canceled_at = new Date().toISOString()
        booking.cancellation_reason = reason
      }
      return booking
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
      // In production:
      // const response = await sdk.client.fetch(`/store/bookings/${bookingId}/reschedule`, {
      //   method: "POST",
      //   body: { start_time: newStartTime, provider_id: newProviderId },
      // })
      // return response.booking

      const booking = mockBookings.find((b) => b.id === bookingId)
      if (booking) {
        booking.start_time = newStartTime
        const duration = booking.service?.duration || 60
        booking.end_time = new Date(
          new Date(newStartTime).getTime() + duration * 60 * 1000
        ).toISOString()
        if (newProviderId) {
          booking.provider_id = newProviderId
          booking.provider = mockProviders.find((p) => p.id === newProviderId)
        }
      }
      return booking
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) })
      queryClient.invalidateQueries({ queryKey: bookingKeys.list() })
    },
  })
}
