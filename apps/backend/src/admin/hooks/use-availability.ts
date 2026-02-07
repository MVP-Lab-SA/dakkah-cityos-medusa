import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "../lib/client"

interface TimeSlot {
  start: string
  end: string
}

interface WeeklySchedule {
  monday: TimeSlot[]
  tuesday: TimeSlot[]
  wednesday: TimeSlot[]
  thursday: TimeSlot[]
  friday: TimeSlot[]
  saturday: TimeSlot[]
  sunday: TimeSlot[]
}

export interface Availability {
  id: string
  tenant_id?: string
  owner_type: "provider" | "service" | "resource"
  owner_id: string
  schedule_type: "weekly_recurring" | "custom"
  weekly_schedule?: WeeklySchedule
  timezone: string
  effective_from?: string
  effective_to?: string
  slot_duration_minutes: number
  slot_increment_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AvailabilityException {
  id: string
  availability_id: string
  tenant_id?: string
  exception_type: "time_off" | "holiday" | "special_hours" | "blocked"
  start_date: string
  end_date: string
  all_day: boolean
  special_hours?: TimeSlot[]
  title?: string
  reason?: string
  is_recurring: boolean
  recurrence_rule?: string
  created_at: string
  updated_at: string
}

interface AvailabilitiesResponse {
  availabilities: Availability[]
}

interface AvailabilityResponse {
  availability: Availability
  exceptions: AvailabilityException[]
}

interface ExceptionResponse {
  exception: AvailabilityException
}

export function useAvailabilities(filters?: {
  owner_type?: string
  owner_id?: string
  is_active?: boolean
}) {
  const params = new URLSearchParams()
  if (filters?.owner_type) params.append("owner_type", filters.owner_type)
  if (filters?.owner_id) params.append("owner_id", filters.owner_id)
  if (filters?.is_active !== undefined) params.append("is_active", String(filters.is_active))
  
  return useQuery({
    queryKey: ["availabilities", filters],
    queryFn: async () => {
      const url = `/admin/availability${params.toString() ? `?${params}` : ""}`
      const { data } = await client.get<AvailabilitiesResponse>(url)
      return data.availabilities
    },
  })
}

export function useAvailability(id: string) {
  return useQuery({
    queryKey: ["availability", id],
    queryFn: async () => {
      const { data } = await client.get<AvailabilityResponse>(`/admin/availability/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateAvailability() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      owner_type: "provider" | "service" | "resource"
      owner_id: string
      schedule_type?: "weekly_recurring" | "custom"
      weekly_schedule?: WeeklySchedule
      timezone?: string
      effective_from?: string
      effective_to?: string
      slot_duration_minutes?: number
      slot_increment_minutes?: number
    }) => {
      const response = await client.post<{ availability: Availability }>("/admin/availability", data)
      return response.data.availability
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availabilities"] })
    },
  })
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string
      weekly_schedule?: WeeklySchedule
      timezone?: string
      effective_from?: string
      effective_to?: string
      slot_duration_minutes?: number
      slot_increment_minutes?: number
      is_active?: boolean
    }) => {
      const response = await client.put<{ availability: Availability }>(`/admin/availability/${id}`, data)
      return response.data.availability
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["availabilities"] })
      queryClient.invalidateQueries({ queryKey: ["availability", variables.id] })
    },
  })
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/admin/availability/${id}`)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availabilities"] })
    },
  })
}

export function useCreateException() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ availabilityId, ...data }: {
      availabilityId: string
      exception_type: "time_off" | "holiday" | "special_hours" | "blocked"
      start_date: string
      end_date: string
      all_day?: boolean
      special_hours?: TimeSlot[]
      title?: string
      reason?: string
      is_recurring?: boolean
      recurrence_rule?: string
    }) => {
      const response = await client.post<ExceptionResponse>(
        `/admin/availability/${availabilityId}/exceptions`,
        data
      )
      return response.data.exception
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["availability", variables.availabilityId] })
    },
  })
}

export function useUpdateException() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, availabilityId, ...data }: {
      id: string
      availabilityId: string
      exception_type?: "time_off" | "holiday" | "special_hours" | "blocked"
      start_date?: string
      end_date?: string
      all_day?: boolean
      special_hours?: TimeSlot[]
      title?: string
      reason?: string
    }) => {
      const response = await client.put<ExceptionResponse>(
        `/admin/availability/exceptions/${id}`,
        data
      )
      return response.data.exception
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["availability", variables.availabilityId] })
    },
  })
}

export function useDeleteException() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, availabilityId }: { id: string; availabilityId: string }) => {
      await client.delete(`/admin/availability/exceptions/${id}`)
      return id
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["availability", variables.availabilityId] })
    },
  })
}
