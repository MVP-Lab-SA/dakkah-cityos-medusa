import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge, Input, Label, Textarea, toast } from "@medusajs/ui"
import { Calendar, Plus, Clock, Trash, PencilSquare } from "@medusajs/icons"
import { useState } from "react"
import {
  useAvailabilities,
  useAvailability,
  useCreateAvailability,
  useUpdateAvailability,
  useDeleteAvailability,
  useCreateException,
  useDeleteException,
  Availability,
  AvailabilityException,
} from "../../hooks/use-availability"
import { useServiceProviders } from "../../hooks/use-bookings"

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const

const DEFAULT_SCHEDULE = {
  monday: [{ start: "09:00", end: "17:00" }],
  tuesday: [{ start: "09:00", end: "17:00" }],
  wednesday: [{ start: "09:00", end: "17:00" }],
  thursday: [{ start: "09:00", end: "17:00" }],
  friday: [{ start: "09:00", end: "17:00" }],
  saturday: [],
  sunday: [],
}

function ScheduleEditor({
  schedule,
  onChange,
}: {
  schedule: typeof DEFAULT_SCHEDULE
  onChange: (schedule: typeof DEFAULT_SCHEDULE) => void
}) {
  const updateDay = (day: typeof DAYS[number], slots: Array<{ start: string; end: string }>) => {
    onChange({ ...schedule, [day]: slots })
  }
  
  const addSlot = (day: typeof DAYS[number]) => {
    const currentSlots = schedule[day] || []
    updateDay(day, [...currentSlots, { start: "09:00", end: "17:00" }])
  }
  
  const removeSlot = (day: typeof DAYS[number], index: number) => {
    const currentSlots = schedule[day] || []
    updateDay(day, currentSlots.filter((_, i) => i !== index))
  }
  
  const updateSlot = (day: typeof DAYS[number], index: number, field: "start" | "end", value: string) => {
    const currentSlots = [...(schedule[day] || [])]
    currentSlots[index] = { ...currentSlots[index], [field]: value }
    updateDay(day, currentSlots)
  }
  
  return (
    <div className="space-y-3">
      {DAYS.map((day) => (
        <div key={day} className="flex items-start gap-4 p-3 border rounded-lg">
          <div className="w-24 font-medium capitalize pt-2">{day}</div>
          <div className="flex-1 space-y-2">
            {(schedule[day] || []).length === 0 ? (
              <Text className="text-ui-fg-muted py-2">Closed</Text>
            ) : (
              (schedule[day] || []).map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateSlot(day, index, "start", e.target.value)}
                    className="w-32"
                  />
                  <Text>to</Text>
                  <Input
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateSlot(day, index, "end", e.target.value)}
                    className="w-32"
                  />
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => removeSlot(day, index)}
                  >
                    <Trash className="text-ui-fg-error" />
                  </Button>
                </div>
              ))
            )}
          </div>
          <Button variant="secondary" size="small" onClick={() => addSlot(day)}>
            <Plus /> Add
          </Button>
        </div>
      ))}
    </div>
  )
}

function ExceptionForm({
  availabilityId,
  onClose,
}: {
  availabilityId: string
  onClose: () => void
}) {
  const [exceptionType, setExceptionType] = useState<"time_off" | "holiday" | "blocked">("time_off")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [allDay, setAllDay] = useState(true)
  const [title, setTitle] = useState("")
  const [reason, setReason] = useState("")
  
  const createException = useCreateException()
  
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates")
      return
    }
    
    try {
      await createException.mutateAsync({
        availabilityId,
        exception_type: exceptionType,
        start_date: startDate,
        end_date: endDate,
        all_day: allDay,
        title: title || undefined,
        reason: reason || undefined,
      })
      toast.success("Exception created")
      onClose()
    } catch (error) {
      toast.error("Failed to create exception")
    }
  }
  
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-ui-bg-subtle">
      <Heading level="h3">Add Exception</Heading>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Type</Label>
          <select
            value={exceptionType}
            onChange={(e) => setExceptionType(e.target.value as any)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="time_off">Time Off</option>
            <option value="holiday">Holiday</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div>
          <Label>Start Date</Label>
          <Input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Vacation, Public Holiday"
        />
      </div>
      
      <div>
        <Label>Reason (optional)</Label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Additional notes..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} isLoading={createException.isPending}>
          Add Exception
        </Button>
      </div>
    </div>
  )
}

function AvailabilityDetail({
  availabilityId,
  onBack,
}: {
  availabilityId: string
  onBack: () => void
}) {
  const { data, isLoading } = useAvailability(availabilityId)
  const updateAvailability = useUpdateAvailability()
  const deleteException = useDeleteException()
  const [schedule, setSchedule] = useState<typeof DEFAULT_SCHEDULE | null>(null)
  const [showExceptionForm, setShowExceptionForm] = useState(false)
  const [slotDuration, setSlotDuration] = useState(30)
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }
  
  if (!data) {
    return <div className="p-8 text-center">Availability not found</div>
  }
  
  const { availability, exceptions } = data
  const currentSchedule = schedule || availability.weekly_schedule || DEFAULT_SCHEDULE
  
  const handleSave = async () => {
    try {
      await updateAvailability.mutateAsync({
        id: availabilityId,
        weekly_schedule: currentSchedule,
        slot_duration_minutes: slotDuration,
      })
      toast.success("Availability updated")
    } catch (error) {
      toast.error("Failed to update availability")
    }
  }
  
  const handleDeleteException = async (exceptionId: string) => {
    if (!confirm("Delete this exception?")) return
    try {
      await deleteException.mutateAsync({ id: exceptionId, availabilityId })
      toast.success("Exception deleted")
    } catch (error) {
      toast.error("Failed to delete exception")
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="transparent" onClick={onBack} className="mb-2">
            Back to List
          </Button>
          <Heading>Edit Availability</Heading>
          <Text className="text-ui-fg-subtle">
            {availability.owner_type}: {availability.owner_id}
          </Text>
        </div>
        <Badge color={availability.is_active ? "green" : "grey"}>
          {availability.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>
      
      <Container className="p-6">
        <div className="space-y-6">
          <div>
            <Heading level="h2" className="mb-4">Weekly Schedule</Heading>
            <ScheduleEditor
              schedule={currentSchedule as typeof DEFAULT_SCHEDULE}
              onChange={setSchedule}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Slot Duration (minutes)</Label>
              <Input
                type="number"
                value={slotDuration || availability.slot_duration_minutes}
                onChange={(e) => setSlotDuration(parseInt(e.target.value))}
                min={15}
                max={480}
              />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input value={availability.timezone} disabled />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave} isLoading={updateAvailability.isPending}>
              Save Schedule
            </Button>
          </div>
        </div>
      </Container>
      
      <Container className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h2">Exceptions</Heading>
          <Button variant="secondary" onClick={() => setShowExceptionForm(true)}>
            <Plus /> Add Exception
          </Button>
        </div>
        
        {showExceptionForm && (
          <ExceptionForm
            availabilityId={availabilityId}
            onClose={() => setShowExceptionForm(false)}
          />
        )}
        
        {exceptions.length === 0 ? (
          <Text className="text-ui-fg-muted py-4">No exceptions configured</Text>
        ) : (
          <div className="space-y-2">
            {exceptions.map((exception) => (
              <div
                key={exception.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge color={
                      exception.exception_type === "time_off" ? "blue" :
                      exception.exception_type === "holiday" ? "purple" :
                      "orange"
                    }>
                      {exception.exception_type.replace("_", " ")}
                    </Badge>
                    {exception.title && <Text className="font-medium">{exception.title}</Text>}
                  </div>
                  <Text className="text-ui-fg-subtle text-sm">
                    {new Date(exception.start_date).toLocaleString()} - {new Date(exception.end_date).toLocaleString()}
                  </Text>
                  {exception.reason && (
                    <Text className="text-ui-fg-muted text-sm">{exception.reason}</Text>
                  )}
                </div>
                <Button
                  variant="transparent"
                  onClick={() => handleDeleteException(exception.id)}
                >
                  <Trash className="text-ui-fg-error" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}

function CreateAvailabilityForm({ onClose }: { onClose: () => void }) {
  const { data: providers } = useServiceProviders()
  const createAvailability = useCreateAvailability()
  
  const [ownerType, setOwnerType] = useState<"provider" | "service" | "resource">("provider")
  const [ownerId, setOwnerId] = useState("")
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)
  const [timezone, setTimezone] = useState("UTC")
  const [slotDuration, setSlotDuration] = useState(30)
  
  const handleSubmit = async () => {
    if (!ownerId) {
      toast.error("Please select an owner")
      return
    }
    
    try {
      await createAvailability.mutateAsync({
        owner_type: ownerType,
        owner_id: ownerId,
        weekly_schedule: schedule,
        timezone,
        slot_duration_minutes: slotDuration,
      })
      toast.success("Availability created")
      onClose()
    } catch (error) {
      toast.error("Failed to create availability")
    }
  }
  
  return (
    <Container className="p-6 space-y-6">
      <Heading level="h2">Create Availability Schedule</Heading>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Owner Type</Label>
          <select
            value={ownerType}
            onChange={(e) => setOwnerType(e.target.value as any)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="provider">Service Provider</option>
            <option value="service">Service</option>
            <option value="resource">Resource</option>
          </select>
        </div>
        <div>
          <Label>Owner</Label>
          {ownerType === "provider" && providers ? (
            <select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            >
              <option value="">Select provider...</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          ) : (
            <Input
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              placeholder="Enter owner ID"
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Timezone</Label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>
        <div>
          <Label>Slot Duration (minutes)</Label>
          <Input
            type="number"
            value={slotDuration}
            onChange={(e) => setSlotDuration(parseInt(e.target.value))}
            min={15}
            max={480}
          />
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Weekly Schedule</Label>
        <ScheduleEditor schedule={schedule} onChange={setSchedule} />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} isLoading={createAvailability.isPending}>
          Create Availability
        </Button>
      </div>
    </Container>
  )
}

const AvailabilityPage = () => {
  const { data: availabilities, isLoading } = useAvailabilities()
  const { data: providers } = useServiceProviders()
  const deleteAvailability = useDeleteAvailability()
  
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const getOwnerName = (availability: Availability) => {
    if (availability.owner_type === "provider" && providers) {
      const provider = providers.find(p => p.id === availability.owner_id)
      return provider?.name || availability.owner_id
    }
    return availability.owner_id
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this availability schedule?")) return
    try {
      await deleteAvailability.mutateAsync(id)
      toast.success("Availability deleted")
    } catch (error) {
      toast.error("Failed to delete")
    }
  }
  
  if (selectedId) {
    return (
      <AvailabilityDetail
        availabilityId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    )
  }
  
  if (showCreateForm) {
    return <CreateAvailabilityForm onClose={() => setShowCreateForm(false)} />
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Availability Management</Heading>
          <Text className="text-ui-fg-subtle">
            Manage schedules for providers, services, and resources
          </Text>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus /> Create Schedule
        </Button>
      </div>
      
      <Container className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : !availabilities?.length ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-ui-fg-muted" />
            <Heading level="h2">No availability schedules</Heading>
            <Text className="text-ui-fg-subtle mb-4">
              Create schedules for your service providers
            </Text>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus /> Create First Schedule
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-ui-fg-subtle">
                <th className="p-4">Owner</th>
                <th className="p-4">Type</th>
                <th className="p-4">Timezone</th>
                <th className="p-4">Slot Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map((availability) => (
                <tr key={availability.id} className="border-b hover:bg-ui-bg-subtle">
                  <td className="p-4">
                    <Text className="font-medium">{getOwnerName(availability)}</Text>
                  </td>
                  <td className="p-4">
                    <Badge>{availability.owner_type}</Badge>
                  </td>
                  <td className="p-4">{availability.timezone}</td>
                  <td className="p-4">{availability.slot_duration_minutes} min</td>
                  <td className="p-4">
                    <Badge color={availability.is_active ? "green" : "grey"}>
                      {availability.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="transparent"
                        size="small"
                        onClick={() => setSelectedId(availability.id)}
                      >
                        <PencilSquare />
                      </Button>
                      <Button
                        variant="transparent"
                        size="small"
                        onClick={() => handleDelete(availability.id)}
                      >
                        <Trash className="text-ui-fg-error" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Availability",
  icon: Calendar,
})

export default AvailabilityPage
