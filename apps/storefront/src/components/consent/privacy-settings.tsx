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

interface PrivacySettingsProps {
  categories: ConsentCategoryInfo[]
  currentPreferences: Record<string, boolean>
  onSave: (preferences: Record<string, boolean>) => void
  dataRetentionDays?: number
  showDeleteAccount?: boolean
  onDeleteAccount?: () => void
  locale?: string
  className?: string
}

export function PrivacySettings({
  categories,
  currentPreferences,
  onSave,
  dataRetentionDays,
  showDeleteAccount = false,
  onDeleteAccount,
  locale: localeProp,
  className,
}: PrivacySettingsProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [preferences, setPreferences] = useState<Record<string, boolean>>({ ...currentPreferences })
  const [saved, setSaved] = useState(false)

  const handleToggle = (id: string, enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, [id]: enabled }))
    setSaved(false)
  }

  const handleSave = () => {
    onSave(preferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className={clsx("space-y-6", className)}>
      <div>
        <h2 className="text-xl font-bold text-ds-foreground">
          {t(locale, "consent.privacy_settings")}
        </h2>
        <p className="text-sm text-ds-muted-foreground mt-1">
          {t(locale, "consent.privacy_settings_desc")}
        </p>
      </div>

      <div className="bg-ds-card border border-ds-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-ds-border">
          <h3 className="text-base font-semibold text-ds-foreground">
            {t(locale, "consent.data_collection")}
          </h3>
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
        <div className="p-6 border-t border-ds-border flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            {t(locale, "consent.save_preferences")}
          </button>
          {saved && (
            <span className="text-sm text-ds-success">
              ✓ {t(locale, "consent.saved")}
            </span>
          )}
        </div>
      </div>

      {dataRetentionDays && (
        <div className="bg-ds-card border border-ds-border rounded-xl p-6">
          <h3 className="text-base font-semibold text-ds-foreground mb-2">
            {t(locale, "consent.data_retention")}
          </h3>
          <p className="text-sm text-ds-muted-foreground">
            {t(locale, "consent.data_retention_desc").replace("{days}", String(dataRetentionDays))}
          </p>
        </div>
      )}

      {showDeleteAccount && (
        <div className="bg-ds-destructive/5 border border-ds-destructive/20 rounded-xl p-6">
          <h3 className="text-base font-semibold text-ds-destructive mb-2">
            {t(locale, "consent.delete_account")}
          </h3>
          <p className="text-sm text-ds-muted-foreground mb-4">
            {t(locale, "consent.delete_account_desc")}
          </p>
          <button
            onClick={onDeleteAccount}
            className="px-4 py-2 text-sm font-medium bg-ds-destructive text-ds-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            {t(locale, "consent.delete_account_btn")}
          </button>
        </div>
      )}
    </div>
  )
}
