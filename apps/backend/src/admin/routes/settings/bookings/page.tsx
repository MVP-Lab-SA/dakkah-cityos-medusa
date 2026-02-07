import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Input, Label, toast } from "@medusajs/ui"
import { Calendar } from "@medusajs/icons"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "../../../lib/client"

interface BookingConfig {
  // Reminder settings
  reminder_enabled: boolean
  reminder_hours_before: number
  reminder_email_template?: string
  
  // Cancellation settings
  cancellation_window_hours: number
  cancellation_fee_percent: number
  allow_reschedule: boolean
  reschedule_window_hours: number
  
  // Buffer settings
  buffer_minutes_before: number
  buffer_minutes_after: number
  
  // No-show settings
  no_show_fee_percent: number
  mark_no_show_after_minutes: number
  
  // General settings
  allow_same_day_booking: boolean
  min_advance_booking_hours: number
  max_advance_booking_days: number
  
  // Check-in settings
  allow_self_checkin: boolean
  checkin_window_minutes: number
}

const DEFAULT_CONFIG: BookingConfig = {
  reminder_enabled: true,
  reminder_hours_before: 24,
  cancellation_window_hours: 24,
  cancellation_fee_percent: 0,
  allow_reschedule: true,
  reschedule_window_hours: 24,
  buffer_minutes_before: 0,
  buffer_minutes_after: 15,
  no_show_fee_percent: 100,
  mark_no_show_after_minutes: 15,
  allow_same_day_booking: true,
  min_advance_booking_hours: 2,
  max_advance_booking_days: 60,
  allow_self_checkin: false,
  checkin_window_minutes: 30,
}

function useBookingConfig() {
  return useQuery({
    queryKey: ["booking-config"],
    queryFn: async () => {
      try {
        const { data } = await client.get<{ config: BookingConfig }>("/admin/settings/bookings")
        return data.config || DEFAULT_CONFIG
      } catch {
        return DEFAULT_CONFIG
      }
    },
  })
}

function useSaveBookingConfig() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (config: BookingConfig) => {
      const { data } = await client.put("/admin/settings/bookings", { config })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-config"] })
    },
  })
}

const BookingConfigPage = () => {
  const { data: config, isLoading } = useBookingConfig()
  const saveConfig = useSaveBookingConfig()
  
  const [formData, setFormData] = useState<BookingConfig>(DEFAULT_CONFIG)
  
  useEffect(() => {
    if (config) {
      setFormData(config)
    }
  }, [config])
  
  const handleChange = (field: keyof BookingConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSave = async () => {
    try {
      await saveConfig.mutateAsync(formData)
      toast.success("Booking configuration saved")
    } catch (error) {
      toast.error("Failed to save configuration")
    }
  }
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading configuration...</div>
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Booking Configuration</Heading>
          <Text className="text-ui-fg-subtle">
            Configure booking rules, reminders, and policies
          </Text>
        </div>
        <Button onClick={handleSave} isLoading={saveConfig.isPending}>
          Save Configuration
        </Button>
      </div>
      
      {/* Reminder Settings */}
      <Container className="p-6">
        <Heading level="h2" className="mb-4">Reminder Settings</Heading>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="reminder_enabled"
              checked={formData.reminder_enabled}
              onChange={(e) => handleChange("reminder_enabled", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="reminder_enabled">Enable booking reminders</Label>
          </div>
          <div>
            <Label>Send reminder X hours before</Label>
            <Input
              type="number"
              value={formData.reminder_hours_before}
              onChange={(e) => handleChange("reminder_hours_before", parseInt(e.target.value))}
              min={1}
              max={72}
            />
          </div>
        </div>
      </Container>
      
      {/* Cancellation Settings */}
      <Container className="p-6">
        <Heading level="h2" className="mb-4">Cancellation Policy</Heading>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Cancellation window (hours before booking)</Label>
            <Input
              type="number"
              value={formData.cancellation_window_hours}
              onChange={(e) => handleChange("cancellation_window_hours", parseInt(e.target.value))}
              min={0}
              max={168}
            />
            <Text className="text-xs text-ui-fg-muted mt-1">
              Customers can cancel free of charge up to this many hours before
            </Text>
          </div>
          <div>
            <Label>Late cancellation fee (%)</Label>
            <Input
              type="number"
              value={formData.cancellation_fee_percent}
              onChange={(e) => handleChange("cancellation_fee_percent", parseInt(e.target.value))}
              min={0}
              max={100}
            />
            <Text className="text-xs text-ui-fg-muted mt-1">
              Percentage of booking cost charged for late cancellations
            </Text>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allow_reschedule"
              checked={formData.allow_reschedule}
              onChange={(e) => handleChange("allow_reschedule", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="allow_reschedule">Allow customers to reschedule</Label>
          </div>
          <div>
            <Label>Reschedule window (hours before booking)</Label>
            <Input
              type="number"
              value={formData.reschedule_window_hours}
              onChange={(e) => handleChange("reschedule_window_hours", parseInt(e.target.value))}
              min={0}
              max={168}
              disabled={!formData.allow_reschedule}
            />
          </div>
        </div>
      </Container>
      
      {/* Buffer Settings */}
      <Container className="p-6">
        <Heading level="h2" className="mb-4">Buffer Time</Heading>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Buffer before booking (minutes)</Label>
            <Input
              type="number"
              value={formData.buffer_minutes_before}
              onChange={(e) => handleChange("buffer_minutes_before", parseInt(e.target.value))}
              min={0}
              max={60}
            />
            <Text className="text-xs text-ui-fg-muted mt-1">
              Preparation time before each booking
            </Text>
          </div>
          <div>
            <Label>Buffer after booking (minutes)</Label>
            <Input
              type="number"
              value={formData.buffer_minutes_after}
              onChange={(e) => handleChange("buffer_minutes_after", parseInt(e.target.value))}
              min={0}
              max={60}
            />
            <Text className="text-xs text-ui-fg-muted mt-1">
              Cleanup/transition time after each booking
            </Text>
          </div>
        </div>
      </Container>
      
      {/* No-Show Settings */}
      <Container className="p-6">
        <Heading level="h2" className="mb-4">No-Show Policy</Heading>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>No-show fee (%)</Label>
            <Input
              type="number"
              value={formData.no_show_fee_percent}
              onChange={(e) => handleChange("no_show_fee_percent", parseInt(e.target.value))}
              min={0}
              max={100}
            />
            <Text className="text-xs text-ui-fg-muted mt-1">
              Percentage of booking cost charged for no-shows
            </Text>
          </div>
          <div>
            <Label>Mark as no-show after (minutes)</Label>
            <Input
              type="number"
              value={formData.mark_no_show_after_minutes}
              onChange={(e) => handleChange("mark_no_show_after_minutes", parseInt(e.target.value))}
              min={5}
              max={60}
            />
            <Text className="text-xs text-ui-fg-muted mt-1">
              Minutes after scheduled start to mark as no-show
            </Text>
          </div>
        </div>
      </Container>
      
      {/* Booking Limits */}
      <Container className="p-6">
        <Heading level="h2" className="mb-4">Booking Limits</Heading>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allow_same_day"
              checked={formData.allow_same_day_booking}
              onChange={(e) => handleChange("allow_same_day_booking", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="allow_same_day">Allow same-day bookings</Label>
          </div>
          <div>
            <Label>Minimum advance notice (hours)</Label>
            <Input
              type="number"
              value={formData.min_advance_booking_hours}
              onChange={(e) => handleChange("min_advance_booking_hours", parseInt(e.target.value))}
              min={0}
              max={168}
            />
          </div>
          <div>
            <Label>Maximum advance booking (days)</Label>
            <Input
              type="number"
              value={formData.max_advance_booking_days}
              onChange={(e) => handleChange("max_advance_booking_days", parseInt(e.target.value))}
              min={1}
              max={365}
            />
          </div>
        </div>
      </Container>
      
      {/* Check-in Settings */}
      <Container className="p-6">
        <Heading level="h2" className="mb-4">Check-in Settings</Heading>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allow_self_checkin"
              checked={formData.allow_self_checkin}
              onChange={(e) => handleChange("allow_self_checkin", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="allow_self_checkin">Allow customer self check-in</Label>
          </div>
          <div>
            <Label>Check-in window (minutes before/after)</Label>
            <Input
              type="number"
              value={formData.checkin_window_minutes}
              onChange={(e) => handleChange("checkin_window_minutes", parseInt(e.target.value))}
              min={5}
              max={60}
            />
            <Text className="text-xs text-ui-fg-muted mt-1">
              How early/late customers can check in
            </Text>
          </div>
        </div>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Booking Settings",
  icon: Calendar,
})

export default BookingConfigPage
