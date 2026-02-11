import { useState, useEffect } from "react"
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

interface CookieConsentBannerProps {
  categories?: ConsentCategoryInfo[]
  onAcceptAll: () => void
  onRejectAll?: () => void
  onSavePreferences: (preferences: Record<string, boolean>) => void
  privacyPolicyUrl?: string
  position?: "bottom" | "top"
  locale?: string
  className?: string
}

const STORAGE_KEY = "cookie_consent_preferences"

const defaultCategories: ConsentCategoryInfo[] = [
  { id: "essential", title: "consent.essential", description: "consent.essential_desc", required: true, defaultEnabled: true },
  { id: "analytics", title: "consent.analytics", description: "consent.analytics_desc", required: false, defaultEnabled: false },
  { id: "marketing", title: "consent.marketing", description: "consent.marketing_desc", required: false, defaultEnabled: false },
  { id: "personalization", title: "consent.personalization", description: "consent.personalization_desc", required: false, defaultEnabled: false },
]

export function CookieConsentBanner({
  categories = defaultCategories,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
  privacyPolicyUrl,
  position = "bottom",
  locale: localeProp,
  className,
}: CookieConsentBannerProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setVisible(true)
        const initial: Record<string, boolean> = {}
        categories.forEach((cat) => { initial[cat.id] = cat.required || cat.defaultEnabled })
        setPreferences(initial)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  if (!mounted || !visible) return null

  const handleAcceptAll = () => {
    const all: Record<string, boolean> = {}
    categories.forEach((cat) => { all[cat.id] = true })
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)) } catch {}
    setVisible(false)
    onAcceptAll()
  }

  const handleRejectAll = () => {
    const required: Record<string, boolean> = {}
    categories.forEach((cat) => { required[cat.id] = cat.required })
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(required)) } catch {}
    setVisible(false)
    onRejectAll?.()
  }

  const handleSave = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)) } catch {}
    setVisible(false)
    onSavePreferences(preferences)
  }

  const handleToggle = (id: string, enabled: boolean) => {
    setPreferences((prev) => ({ ...prev, [id]: enabled }))
  }

  return (
    <div
      className={clsx(
        "fixed start-0 end-0 z-50 p-4",
        position === "bottom" ? "bottom-0" : "top-0",
        className
      )}
    >
      <div className="max-w-3xl mx-auto bg-ds-background rounded-xl border border-ds-border shadow-lg overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl flex-shrink-0">🍪</span>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-ds-foreground mb-1">
                {t(locale, "consent.title")}
              </h3>
              <p className="text-sm text-ds-muted-foreground">
                {t(locale, "consent.message")}
                {privacyPolicyUrl && (
                  <>
                    {" "}
                    <a href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-ds-primary hover:underline">
                      {t(locale, "consent.privacy_policy")}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          {showCustomize && (
            <div className="space-y-3 mb-4 p-4 bg-ds-muted rounded-lg">
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
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "consent.accept_all")}
            </button>
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm font-medium bg-ds-muted text-ds-foreground rounded-lg hover:bg-ds-background transition-colors border border-ds-border"
            >
              {t(locale, "consent.reject_all")}
            </button>
            {showCustomize ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-ds-muted text-ds-foreground rounded-lg hover:bg-ds-background transition-colors border border-ds-border"
              >
                {t(locale, "consent.save_preferences")}
              </button>
            ) : (
              <button
                onClick={() => setShowCustomize(true)}
                className="px-4 py-2 text-sm font-medium text-ds-muted-foreground hover:text-ds-foreground transition-colors"
              >
                {t(locale, "consent.customize")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
