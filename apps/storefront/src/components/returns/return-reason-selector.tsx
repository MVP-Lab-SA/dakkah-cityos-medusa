import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface ReturnReasonSelectorProps {
  reasons: string[]
  selectedReason?: string
  onSelect: (reason: string) => void
  otherDetails?: string
  onOtherDetailsChange?: (details: string) => void
  locale?: string
  className?: string
}

export function ReturnReasonSelector({
  reasons,
  selectedReason,
  onSelect,
  otherDetails = "",
  onOtherDetailsChange,
  locale: localeProp,
  className,
}: ReturnReasonSelectorProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className={clsx("space-y-3", className)}>
      <label className="block text-sm font-medium text-ds-foreground text-start">
        {t(locale, "returns.reason")}
      </label>
      <div className="space-y-2">
        {reasons.map((reason) => (
          <button
            key={reason}
            onClick={() => onSelect(reason)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-start transition-all text-sm",
              selectedReason === reason
                ? "border-ds-primary bg-ds-primary/5 ring-1 ring-ds-primary/20"
                : "border-ds-border bg-ds-card hover:border-ds-primary/50"
            )}
          >
            <div className={clsx(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
              selectedReason === reason ? "border-ds-primary" : "border-ds-border"
            )}>
              {selectedReason === reason && (
                <div className="w-2 h-2 rounded-full bg-ds-primary" />
              )}
            </div>
            <span className="text-ds-foreground">{reason}</span>
          </button>
        ))}
      </div>

      {selectedReason && onOtherDetailsChange && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-ds-foreground mb-1 text-start">
            {t(locale, "returns.additional_notes")}
          </label>
          <textarea
            value={otherDetails}
            onChange={(e) => onOtherDetailsChange(e.target.value)}
            placeholder={t(locale, "returns.notes_placeholder")}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary text-sm resize-none"
          />
        </div>
      )}
    </div>
  )
}
