import { useMemo } from "react"
import { t, formatCurrency, type SupportedLocale } from "@/lib/i18n"
import { clsx } from "clsx"

interface DeliverySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  price?: { amount: number; currency: string }
  type?: "standard" | "express" | "same-day"
  capacity?: number
  remaining?: number
}

interface DeliverySlotPickerProps {
  availableSlots: DeliverySlot[]
  selectedSlotId?: string
  onSlotSelect: (slotId: string) => void
  variant?: "grid" | "list"
  showPrice?: boolean
  locale: string
  className?: string
}

const typeKeys: Record<string, string> = {
  standard: "delivery.standard",
  express: "delivery.express",
  "same-day": "delivery.same_day",
}

const typeColors: Record<string, string> = {
  standard: "bg-ds-muted text-ds-muted-foreground",
  express: "bg-ds-warning text-ds-warning",
  "same-day": "bg-ds-info text-ds-info",
}

export function DeliverySlotPicker({
  availableSlots,
  selectedSlotId,
  onSlotSelect,
  variant = "grid",
  showPrice = true,
  locale,
  className,
}: DeliverySlotPickerProps) {
  const groupedSlots = useMemo(() => {
    const groups: Record<string, DeliverySlot[]> = {}
    for (const slot of availableSlots) {
      const dateKey = slot.date
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(slot)
    }
    return groups
  }, [availableSlots])

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"

    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (!availableSlots.length) {
    return (
      <div className={clsx("bg-ds-muted rounded-lg p-8 text-center", className)}>
        <p className="text-ds-muted-foreground">{t(locale, "delivery.no_slots")}</p>
      </div>
    )
  }

  return (
    <div className={clsx("space-y-6", className)}>
      <h3 className="text-lg font-semibold text-ds-foreground">
        {t(locale, "delivery.select_slot")}
      </h3>

      {Object.entries(groupedSlots).map(([date, slots]) => (
        <div key={date}>
          <h4 className="text-sm font-medium text-ds-muted-foreground mb-3">
            {formatDateLabel(date)}
          </h4>

          <div
            className={clsx(
              variant === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                : "space-y-2"
            )}
          >
            {slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id
              const isDisabled = !slot.available

              return (
                <button
                  key={slot.id}
                  onClick={() => !isDisabled && onSlotSelect(slot.id)}
                  disabled={isDisabled}
                  className={clsx(
                    "relative rounded-lg border p-4 text-start transition-all",
                    variant === "list" && "flex items-center gap-4",
                    isSelected
                      ? "border-ds-foreground bg-ds-primary/5 ring-2 ring-ds-primary"
                      : "border-ds-border bg-ds-background hover:border-ds-foreground",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 end-2 w-5 h-5 rounded-full bg-ds-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-ds-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  <div className={variant === "list" ? "flex-1" : ""}>
                    <p className="font-medium text-ds-foreground">
                      {slot.startTime} – {slot.endTime}
                    </p>

                    {slot.type && (
                      <span
                        className={clsx(
                          "inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded",
                          typeColors[slot.type] || "bg-ds-muted text-ds-muted-foreground"
                        )}
                      >
                        {t(locale, typeKeys[slot.type] || "delivery.standard")}
                      </span>
                    )}

                    {slot.remaining !== undefined && slot.remaining <= 3 && (
                      <p className="text-xs text-ds-destructive mt-1">
                        {slot.remaining} {slot.remaining === 1 ? "slot" : "slots"} left
                      </p>
                    )}
                  </div>

                  {showPrice && slot.price && (
                    <div className={clsx("text-end", variant === "list" ? "flex-shrink-0" : "mt-2")}>
                      <p className="text-sm font-semibold text-ds-foreground">
                        {slot.price.amount === 0
                          ? t(locale, "delivery.free")
                          : formatCurrency(slot.price.amount, slot.price.currency, locale as SupportedLocale)}
                      </p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
