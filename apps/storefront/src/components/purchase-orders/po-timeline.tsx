import { PurchaseOrder } from "@/lib/hooks/use-purchase-orders"
import { Check, Clock, XMark, PencilSquare, SquaresPlus } from "@medusajs/icons"
import { cn } from "@/lib/utils/cn"

interface POTimelineProps {
  purchaseOrder: PurchaseOrder
}

export function POTimeline({ purchaseOrder: po }: POTimelineProps) {
  const formatDate = (date?: string) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSteps = () => {
    const steps = [
      {
        status: "created",
        label: "Created",
        date: po.created_at,
        icon: PencilSquare,
        completed: true,
      },
      {
        status: "submitted",
        label: "Submitted",
        date: po.submitted_at,
        icon: SquaresPlus,
        completed: !!po.submitted_at,
      },
    ]

    if (po.status === "rejected") {
      steps.push({
        status: "rejected",
        label: "Rejected",
        date: po.updated_at,
        icon: XMark,
        completed: true,
      })
    } else {
      steps.push({
        status: "approved",
        label: "Approved",
        date: po.approved_at,
        icon: Check,
        completed: !!po.approved_at,
      })

      if (po.status === "fulfilled") {
        steps.push({
          status: "fulfilled",
          label: "Fulfilled",
          date: po.updated_at,
          icon: Check,
          completed: true,
        })
      }
    }

    return steps
  }

  const steps = getSteps()

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-6">Timeline</h3>

      <div className="relative">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const isRejected = step.status === "rejected"

          return (
            <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
              {/* Icon */}
              <div className="relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    step.completed && !isRejected && "bg-green-100",
                    step.completed && isRejected && "bg-red-100",
                    !step.completed && "bg-zinc-100"
                  )}
                >
                  <step.icon
                    className={cn(
                      "w-5 h-5",
                      step.completed && !isRejected && "text-green-600",
                      step.completed && isRejected && "text-red-600",
                      !step.completed && "text-zinc-400"
                    )}
                  />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-10 w-0.5 h-full -translate-x-1/2",
                      step.completed ? "bg-green-200" : "bg-zinc-200"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <p
                  className={cn(
                    "font-medium",
                    step.completed && !isRejected && "text-green-700",
                    step.completed && isRejected && "text-red-700",
                    !step.completed && "text-zinc-400"
                  )}
                >
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-sm text-zinc-500 mt-0.5">{formatDate(step.date)}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
