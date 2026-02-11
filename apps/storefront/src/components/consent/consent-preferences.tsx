import { useState } from "react"
import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"
import { ConsentToggle } from "./consent-toggle"

interface ConsentCategoryInfo {
  id: string
  title: string
  description: string
  required: boolean
  defaultEnabled: boolean
}

interface ConsentPreferencesProps {
  categories: ConsentCategoryInfo[]
  currentPreferences: Record<string, boolean>
  onSave: (preferences: Record<string, boolean>) => void
  onCancel: () => void
  locale?: string
  className?: string
}

export function ConsentPreferences({
  categories,
  currentPreferences,
  onSave,
  onCancel,
  locale: localeProp,
  className,
}: ConsentPreferencesProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [preferences, setPreferences] = useState<Record<string, boolean>>({ ...currentPreferences })

  const handleToggle = (id: string, enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, [id]: enabled }))
  }

  const handleAcceptAll = () => {
    const all: Record<string, boolean> = {}
    categories.forEach((cat) => { all[cat.id] = true })
    setPreferences(all)
  }

  const handleRejectOptional = () => {
    const required: Record<string, boolean> = {}
    categories.forEach((cat) => { required[cat.id] = cat.required })
    setPreferences(required)
  }

  return (
    <div className={clsx("bg-ds-card border border-ds-border rounded-xl overflow-hidden", className)}>
      <div className="p-6 border-b border-ds-border">
        <h3 className="text-lg font-semibold text-ds-foreground">
          {t(locale, "consent.preferences_title")}
        </h3>
        <p className="text-sm text-ds-muted-foreground mt-1">
          {t(locale, "consent.preferences_desc")}
        </p>
      </div>

      <div className="p-6 space-y-4">
        {categories.map((cat) => (
          <ConsentToggle
            key={cat.id}
            id={cat.id}
            label={t(locale, cat.title)}
            description={t(locale, cat.description)}
            enabled={preferences[cat.id] ?? cat.defaultEnabled}
            required={cat.required}
            onChange={handleToggle}
            locale={locale}
          />
        ))}
      </div>

      <div className="p-6 border-t border-ds-border flex flex-wrap items-center gap-3">
        <button
          onClick={() => onSave(preferences)}
          className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          {t(locale, "consent.save_preferences")}
        </button>
        <button
          onClick={handleAcceptAll}
          className="px-4 py-2 text-sm font-medium bg-ds-muted text-ds-foreground rounded-lg hover:bg-ds-background transition-colors border border-ds-border"
        >
          {t(locale, "consent.accept_all")}
        </button>
        <button
          onClick={handleRejectOptional}
          className="px-4 py-2 text-sm font-medium text-ds-muted-foreground hover:text-ds-foreground transition-colors"
        >
          {t(locale, "consent.reject_optional")}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-ds-muted-foreground hover:text-ds-foreground transition-colors ms-auto"
        >
          {t(locale, "common.cancel")}
        </button>
      </div>
    </div>
  )
}
