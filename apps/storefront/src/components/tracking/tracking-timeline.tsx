import React from "react"

interface TrackingStep {
  key: string
  title: string
  description: string
  timestamp?: string
  status: "completed" | "active" | "pending"
}

interface TrackingTimelineProps {
  orderId: string
  trackingNumber?: string
  currentStep?: number
  estimatedDelivery?: string
}

const defaultSteps: Omit<TrackingStep, "status">[] = [
  {
    key: "placed",
    title: "Order Placed",
    description: "Your order has been confirmed",
  },
  {
    key: "processing",
    title: "Processing",
    description: "Your order is being prepared",
  },
  {
    key: "shipped",
    title: "Shipped",
    description: "Your order is on its way",
  },
  {
    key: "out_for_delivery",
    title: "Out for Delivery",
    description: "Your order is out for delivery",
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Your order has been delivered",
  },
]

export function TrackingTimeline({
  orderId,
  trackingNumber,
  currentStep = 0,
  estimatedDelivery,
}: TrackingTimelineProps) {
  const steps: TrackingStep[] = defaultSteps.map((step, index) => ({
    ...step,
    status:
      index < currentStep
        ? "completed"
        : index === currentStep
        ? "active"
        : "pending",
    timestamp:
      index <= currentStep
        ? new Date(Date.now() - (currentStep - index) * 86400000).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }
          )
        : undefined,
  }))

  return (
    <div className="bg-ds-card rounded-xl border border-ds-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-ds-foreground">
            Order Tracking
          </h3>
          <p className="text-sm text-ds-muted-foreground mt-0.5">
            Order #{orderId}
          </p>
        </div>
        {trackingNumber && (
          <div className="text-right">
            <p className="text-xs text-ds-muted-foreground">Tracking Number</p>
            <p className="text-sm font-mono font-medium text-ds-foreground">
              {trackingNumber}
            </p>
          </div>
        )}
      </div>

      {estimatedDelivery && currentStep < defaultSteps.length - 1 && (
        <div className="mb-6 px-4 py-3 bg-ds-primary/10 border border-ds-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-ds-primary">
              Estimated Delivery: {estimatedDelivery}
            </span>
          </div>
        </div>
      )}

      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.key} className="flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                  step.status === "completed"
                    ? "bg-ds-primary border-ds-primary text-ds-primary-foreground"
                    : step.status === "active"
                    ? "bg-ds-primary/10 border-ds-primary text-ds-primary"
                    : "bg-ds-muted border-ds-border text-ds-muted-foreground"
                }`}
              >
                {step.status === "completed" ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.status === "active" ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-ds-primary animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-ds-muted-foreground/40" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 flex-1 mt-1 ${
                    step.status === "completed"
                      ? "bg-ds-primary"
                      : "bg-ds-border"
                  }`}
                />
              )}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <h4
                className={`text-sm font-medium ${
                  step.status === "pending"
                    ? "text-ds-muted-foreground"
                    : "text-ds-foreground"
                }`}
              >
                {step.title}
              </h4>
              <p
                className={`text-xs mt-0.5 ${
                  step.status === "pending"
                    ? "text-ds-muted-foreground/60"
                    : "text-ds-muted-foreground"
                }`}
              >
                {step.description}
              </p>
              {step.timestamp && (
                <p className="text-xs text-ds-muted-foreground mt-1">
                  {step.timestamp}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
