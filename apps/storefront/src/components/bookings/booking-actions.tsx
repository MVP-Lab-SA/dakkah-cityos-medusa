import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, XMark, ChatBubbleLeftRight } from "@medusajs/icons"

interface BookingActionsProps {
  bookingId: string
  status: string
  onReschedule?: () => void
  onCancel?: () => Promise<void>
  canReschedule?: boolean
  canCancel?: boolean
}

export function BookingActions({
  bookingId,
  status,
  onReschedule,
  onCancel,
  canReschedule = true,
  canCancel = true,
}: BookingActionsProps) {
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancel = async () => {
    if (!onCancel) return
    setIsCancelling(true)
    try {
      await onCancel()
    } catch (error) {
      console.error("Failed to cancel booking:", error)
    } finally {
      setIsCancelling(false)
    }
  }

  const isActive = ["confirmed", "pending"].includes(status.toLowerCase())
  const isCancelled = status.toLowerCase() === "cancelled"
  const isCompleted = status.toLowerCase() === "completed"

  if (isCancelled) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">Booking Cancelled</h3>
        <p className="text-sm text-zinc-500 mb-4">
          This booking has been cancelled. You can book a new appointment anytime.
        </p>
        <Button>Book New Appointment</Button>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">Booking Completed</h3>
        <p className="text-sm text-zinc-500 mb-4">
          This appointment has been completed. Thank you for your visit!
        </p>
        <div className="space-y-3">
          <Button className="w-full">Book Again</Button>
          <Button variant="outline" className="w-full">
            Leave a Review
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Manage Booking</h3>
      
      <div className="space-y-3">
        {/* Reschedule */}
        {canReschedule && isActive && onReschedule && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onReschedule}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Reschedule Appointment
          </Button>
        )}

        {/* Cancel */}
        {canCancel && isActive && onCancel && (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            <XMark className="w-4 h-4 mr-2" />
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </Button>
        )}

        {/* Get Help */}
        <Button variant="ghost" className="w-full justify-start text-zinc-600">
          <ChatBubbleLeftRight className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>

      {/* Cancellation Policy */}
      {isActive && (
        <p className="mt-4 text-xs text-zinc-500">
          Free cancellation up to 24 hours before your appointment. 
          Late cancellations may incur a fee.
        </p>
      )}
    </div>
  )
}
