import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
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
  const toast = useToast()

  const handleCancel = async () => {
    if (!onCancel) return
    setIsCancelling(true)
    try {
      await onCancel()
      toast.success("Booking cancelled successfully")
    } catch (error) {
      toast.error("Failed to cancel booking. Please try again.")
    } finally {
      setIsCancelling(false)
    }
  }

  const isActive = ["confirmed", "pending"].includes(status.toLowerCase())
  const isCancelled = status.toLowerCase() === "cancelled"
  const isCompleted = status.toLowerCase() === "completed"

  if (isCancelled) {
    return (
      <div className="bg-ds-background rounded-xl border border-ds-border p-6">
        <h3 className="text-lg font-semibold text-ds-foreground mb-2">Booking Cancelled</h3>
        <p className="text-sm text-ds-muted-foreground mb-4">
          This booking has been cancelled. You can book a new appointment anytime.
        </p>
        <Button>Book New Appointment</Button>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="bg-ds-background rounded-xl border border-ds-border p-6">
        <h3 className="text-lg font-semibold text-ds-foreground mb-2">Booking Completed</h3>
        <p className="text-sm text-ds-muted-foreground mb-4">
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
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <h3 className="text-lg font-semibold text-ds-foreground mb-4">Manage Booking</h3>
      
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
            className="w-full justify-start text-ds-destructive hover:text-ds-destructive hover:bg-ds-destructive"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            <XMark className="w-4 h-4 mr-2" />
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </Button>
        )}

        {/* Get Help */}
        <Button variant="ghost" className="w-full justify-start text-ds-muted-foreground">
          <ChatBubbleLeftRight className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
      </div>

      {/* Cancellation Policy */}
      {isActive && (
        <p className="mt-4 text-xs text-ds-muted-foreground">
          Free cancellation up to 24 hours before your appointment. 
          Late cancellations may incur a fee.
        </p>
      )}
    </div>
  )
}
