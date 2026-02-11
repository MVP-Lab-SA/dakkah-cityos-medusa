import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface ConsentToggleProps {
  id: string
  label: string
  description?: string
  enabled: boolean
  required?: boolean
  onChange: (id: string, enabled: boolean) => void
  locale?: string
  className?: string
}

export function ConsentToggle({
  id,
  label,
  description,
  enabled,
  required = false,
  onChange,
  locale: localeProp,
  className,
}: ConsentToggleProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <div className={clsx("flex items-start gap-3", className)}>
      <div className="pt-0.5">
        <button
          onClick={() => !required && onChange(id, !enabled)}
          disabled={required}
          className={clsx(
            "w-10 h-5 rounded-full transition-colors relative",
            enabled || required ? "bg-ds-primary" : "bg-ds-border",
            required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          )}
          aria-label={label}
          role="switch"
          aria-checked={enabled || required}
        >
          <span
            className={clsx(
              "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
              enabled || required ? "start-5" : "start-0.5"
            )}
          />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ds-foreground">{label}</span>
          {required && (
            <span className="text-[10px] font-medium text-ds-muted-foreground bg-ds-muted px-1.5 py-0.5 rounded">
              {t(locale, "consent.required")}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-ds-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  )
}
