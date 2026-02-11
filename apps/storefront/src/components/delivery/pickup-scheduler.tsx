import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface PickupSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  remaining?: number
}

interface PickupSchedulerProps {
  storeId: string
  availableSlots: PickupSlot[]
  selectedSlotId?: string
  onSlotSelect: (slotId: string) => void
  locale?: string
  className?: string
}

export function PickupScheduler({
  storeId: _storeId,
  availableSlots,
  selectedSlotId,
  onSlotSelect,
  locale: localeProp,
  className,
}: PickupSchedulerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const groupedByDate = availableSlots.reduce<Record<string, PickupSlot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = []
    acc[slot.date].push(slot)
    return acc
  }, {})

  const dates = Object.keys(groupedByDate).sort()

  if (!dates.length) {
    return (
      <div className={clsx("bg-ds-muted rounded-lg p-6 text-center", className)}>
        <span className="text-3xl block mb-2">📅</span>
        <p className="text-sm text-ds-muted-foreground">{t(locale, "bopis.no_slots")}</p>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(
      locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US",
      { weekday: "short", month: "short", day: "numeric" }
    )
  }

  return (
    <div className={clsx("space-y-4", className)}>
      <h3 className="text-base font-semibold text-ds-foreground">
        {t(locale, "bopis.select_pickup_time")}
      </h3>

      {dates.map((date) => (
        <div key={date}>
          <h4 className="text-sm font-medium text-ds-foreground mb-2">{formatDate(date)}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {groupedByDate[date].map((slot) => {
              const isSelected = selectedSlotId === slot.id

              return (
                <button
                  key={slot.id}
                  onClick={() => slot.available && onSlotSelect(slot.id)}
                  disabled={!slot.available}
                  className={clsx(
                    "rounded-lg border p-3 text-center transition-all text-sm",
                    isSelected
                      ? "border-ds-primary bg-ds-primary/5 ring-2 ring-ds-primary"
                      : "border-ds-border bg-ds-background hover:border-ds-foreground",
                    !slot.available && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <span className="font-medium text-ds-foreground block">
                    {slot.startTime} – {slot.endTime}
                  </span>
                  {slot.remaining !== undefined && slot.remaining <= 5 && slot.available && (
                    <span className="text-xs text-ds-warning mt-1 block">
                      {t(locale, "bopis.slots_remaining").replace("{count}", String(slot.remaining))}
                    </span>
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
