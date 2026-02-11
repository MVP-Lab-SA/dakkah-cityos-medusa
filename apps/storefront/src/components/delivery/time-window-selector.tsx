import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface TimeWindow {
  id: string
  label: string
  startTime: string
  endTime: string
  available: boolean
  icon?: string
}

interface TimeWindowSelectorProps {
  windows: TimeWindow[]
  selectedId?: string
  onSelect: (windowId: string) => void
  locale?: string
  className?: string
}

const defaultIcons: Record<string, string> = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌆",
  night: "🌙",
}

export function TimeWindowSelector({
  windows,
  selectedId,
  onSelect,
  locale: localeProp,
  className,
}: TimeWindowSelectorProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (!windows.length) {
    return (
      <div className={clsx("bg-ds-muted rounded-lg p-6 text-center", className)}>
        <p className="text-sm text-ds-muted-foreground">{t(locale, "deliverySlots.no_windows")}</p>
      </div>
    )
  }

  return (
    <div className={clsx("space-y-3", className)}>
      <h4 className="text-sm font-semibold text-ds-foreground">
        {t(locale, "deliverySlots.select_time")}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {windows.map((window) => {
          const isSelected = selectedId === window.id
          const icon = window.icon || defaultIcons[window.label.toLowerCase()] || "🕐"

          return (
            <button
              key={window.id}
              onClick={() => window.available && onSelect(window.id)}
              disabled={!window.available}
              className={clsx(
                "rounded-lg border p-3 text-center transition-all",
                isSelected
                  ? "border-ds-primary bg-ds-primary/5 ring-2 ring-ds-primary"
                  : "border-ds-border bg-ds-background hover:border-ds-foreground",
                !window.available && "opacity-40 cursor-not-allowed"
              )}
            >
              <span className="text-2xl block mb-1">{icon}</span>
              <span className="font-medium text-sm text-ds-foreground block">{window.label}</span>
              <span className="text-xs text-ds-muted-foreground block mt-0.5">
                {window.startTime} – {window.endTime}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
