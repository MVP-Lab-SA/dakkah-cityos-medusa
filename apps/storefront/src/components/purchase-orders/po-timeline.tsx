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
    <div className="bg-ds-background rounded-xl border border-ds-border p-6">
      <h3 className="text-lg font-semibold text-ds-foreground mb-6">Timeline</h3>

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
                    step.completed && !isRejected && "bg-ds-success",
                    step.completed && isRejected && "bg-ds-destructive",
                    !step.completed && "bg-ds-muted"
                  )}
                >
                  <step.icon
                    className={cn(
                      "w-5 h-5",
                      step.completed && !isRejected && "text-ds-success",
                      step.completed && isRejected && "text-ds-destructive",
                      !step.completed && "text-ds-muted-foreground"
                    )}
                  />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-10 w-0.5 h-full -translate-x-1/2",
                      step.completed ? "bg-ds-success" : "bg-ds-muted"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <p
                  className={cn(
                    "font-medium",
                    step.completed && !isRejected && "text-ds-success",
                    step.completed && isRejected && "text-ds-destructive",
                    !step.completed && "text-ds-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-sm text-ds-muted-foreground mt-0.5">{formatDate(step.date)}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
