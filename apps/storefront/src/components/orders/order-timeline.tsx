import { Check, Clock, XMark } from "@medusajs/icons"
import { cn } from "@/lib/utils/cn"

interface TimelineStep {
  status: string
  label: string
  date?: string
  description?: string
}

interface OrderTimelineProps {
  currentStatus: string
  events?: Array<{
    status: string
    created_at: string
    description?: string
  }>
}

export function OrderTimeline({ currentStatus, events }: OrderTimelineProps) {
  const defaultSteps: TimelineStep[] = [
    { status: "pending", label: "Order Placed" },
    { status: "processing", label: "Processing" },
    { status: "shipped", label: "Shipped" },
    { status: "delivered", label: "Delivered" },
  ]

  const isCancelled = currentStatus.toLowerCase() === "cancelled"
  const isRefunded = currentStatus.toLowerCase() === "refunded"

  const getStepStatus = (stepStatus: string, index: number) => {
    const statusOrder = ["pending", "processing", "shipped", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase())
    const stepIndex = statusOrder.indexOf(stepStatus.toLowerCase())

    if (isCancelled || isRefunded) {
      return stepIndex === 0 ? "completed" : "cancelled"
    }

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "pending"
  }

  const formatDate = (date?: string) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Match events to steps
  const stepsWithDates = defaultSteps.map((step) => {
    const event = events?.find(
      (e) => e.status.toLowerCase() === step.status.toLowerCase()
    )
    return {
      ...step,
      date: event?.created_at,
      description: event?.description,
    }
  })

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-6">Order Timeline</h3>
      
      <div className="relative">
        {stepsWithDates.map((step, index) => {
          const status = getStepStatus(step.status, index)
          const isLast = index === stepsWithDates.length - 1

          return (
            <div key={step.status} className="flex gap-4 pb-8 last:pb-0">
              {/* Icon */}
              <div className="relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    status === "completed" && "bg-green-100",
                    status === "current" && "bg-blue-100",
                    status === "pending" && "bg-zinc-100",
                    status === "cancelled" && "bg-red-100"
                  )}
                >
                  {status === "completed" && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                  {status === "current" && (
                    <Clock className="w-5 h-5 text-blue-600" />
                  )}
                  {status === "pending" && (
                    <div className="w-2 h-2 rounded-full bg-zinc-300" />
                  )}
                  {status === "cancelled" && (
                    <XMark className="w-5 h-5 text-red-600" />
                  )}
                </div>
                {/* Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-10 w-0.5 h-full -translate-x-1/2",
                      status === "completed" ? "bg-green-200" : "bg-zinc-200"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <p
                  className={cn(
                    "font-medium",
                    status === "completed" && "text-green-700",
                    status === "current" && "text-blue-700",
                    status === "pending" && "text-zinc-400",
                    status === "cancelled" && "text-red-700"
                  )}
                >
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {formatDate(step.date)}
                  </p>
                )}
                {step.description && (
                  <p className="text-sm text-zinc-600 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}

        {/* Cancelled/Refunded status */}
        {(isCancelled || isRefunded) && (
          <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <XMark className="w-5 h-5 text-red-600" />
            </div>
            <div className="pt-2">
              <p className="font-medium text-red-700">
                {isCancelled ? "Order Cancelled" : "Order Refunded"}
              </p>
              <p className="text-sm text-zinc-500 mt-0.5">
                {isCancelled
                  ? "This order has been cancelled"
                  : "This order has been refunded"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
