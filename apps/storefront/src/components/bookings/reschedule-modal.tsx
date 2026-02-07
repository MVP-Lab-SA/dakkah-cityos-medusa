import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check } from "@medusajs/icons"
import { cn } from "@/lib/utils/cn"

interface TimeSlot {
  time: string
  available: boolean
}

interface RescheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDate: string
  serviceName: string
  onReschedule?: (date: string, time: string) => Promise<void>
}

export function RescheduleModal({
  open,
  onOpenChange,
  currentDate,
  serviceName,
  onReschedule,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isRescheduling, setIsRescheduling] = useState(false)

  // Generate mock time slots
  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: false },
    { time: "16:00", available: true },
    { time: "16:30", available: true },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDateSelectable = (date: Date | null) => {
    if (!date) return false
    return date >= today
  }

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime || !onReschedule) return
    setIsRescheduling(true)
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      await onReschedule(dateStr, selectedTime)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to reschedule:", error)
    } finally {
      setIsRescheduling(false)
    }
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-zinc-500">{serviceName}</p>

        {/* Calendar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-zinc-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-zinc-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-xs font-medium text-zinc-400 py-2">
                {day}
              </div>
            ))}
            {days.map((date, index) => {
              const isSelectable = isDateSelectable(date)
              const isSelected = selectedDate && date && 
                selectedDate.toDateString() === date.toDateString()

              return (
                <button
                  key={index}
                  onClick={() => isSelectable && date && setSelectedDate(date)}
                  disabled={!isSelectable}
                  className={cn(
                    "py-2 rounded-lg text-sm",
                    !date && "invisible",
                    isSelectable && !isSelected && "hover:bg-zinc-100",
                    !isSelectable && date && "text-zinc-300 cursor-not-allowed",
                    isSelected && "bg-zinc-900 text-white"
                  )}
                >
                  {date?.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-zinc-900 mb-3">Available Times</h4>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "py-2 px-3 rounded-lg text-sm border",
                    slot.available && selectedTime !== slot.time && "border-zinc-200 hover:border-zinc-300",
                    !slot.available && "border-zinc-100 text-zinc-300 cursor-not-allowed",
                    selectedTime === slot.time && "border-zinc-900 bg-zinc-900 text-white"
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleReschedule} 
            disabled={!selectedDate || !selectedTime || isRescheduling}
          >
            {isRescheduling ? "Rescheduling..." : "Confirm New Time"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
