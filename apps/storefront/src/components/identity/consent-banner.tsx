import { useState, useEffect } from "react"
import { t } from "@/lib/i18n"
import { useParams } from "@tanstack/react-router"

interface ConsentCategory {
  id: string
  title: string
  description: string
  required: boolean
}

interface ConsentBannerProps {
  categories?: ConsentCategory[]
  privacyPolicyUrl?: string
  onAcceptAll?: () => void
  onRejectAll?: () => void
  onSavePreferences?: (preferences: Record<string, boolean>) => void
}

const STORAGE_KEY = "consent_preferences"

const defaultCategories: ConsentCategory[] = [
  {
    id: "necessary",
    title: "identity.consent_necessary",
    description: "identity.consent_necessary_desc",
    required: true,
  },
  {
    id: "analytics",
    title: "identity.consent_analytics",
    description: "identity.consent_analytics_desc",
    required: false,
  },
  {
    id: "marketing",
    title: "identity.consent_marketing",
    description: "identity.consent_marketing_desc",
    required: false,
  },
  {
    id: "personalization",
    title: "identity.consent_personalization",
    description: "identity.consent_personalization_desc",
    required: false,
  },
]

export function ConsentBanner({
  categories = defaultCategories,
  privacyPolicyUrl,
  onAcceptAll,
  onRejectAll,
  onSavePreferences,
}: ConsentBannerProps) {
  const { locale } = useParams({ strict: false }) as { locale: string }
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setVisible(true)
        const initial: Record<string, boolean> = {}
        categories.forEach((cat) => {
          initial[cat.id] = cat.required
        })
        setPreferences(initial)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  if (!mounted || !visible) return null

  const handleAcceptAll = () => {
    const all: Record<string, boolean> = {}
    categories.forEach((cat) => {
      all[cat.id] = true
    })
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)) } catch {}
    setVisible(false)
    onAcceptAll?.()
  }

  const handleRejectAll = () => {
    const required: Record<string, boolean> = {}
    categories.forEach((cat) => {
      required[cat.id] = cat.required
    })
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(required)) } catch {}
    setVisible(false)
    onRejectAll?.()
  }

  const handleSave = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)) } catch {}
    setVisible(false)
    onSavePreferences?.(preferences)
  }

  const togglePreference = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="fixed bottom-0 start-0 end-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-ds-background rounded-xl border border-ds-border shadow-lg overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl flex-shrink-0">🍪</span>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-ds-foreground mb-1">
                {t(locale, "identity.consent")}
              </h3>
              <p className="text-sm text-ds-muted-foreground">
                {t(locale, "identity.consent_message")}
                {privacyPolicyUrl && (
                  <>
                    {" "}
                    <a
                      href={privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ds-primary hover:underline"
                    >
                      {t(locale, "identity.consent_privacy_policy")}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          {showDetails && (
            <div className="space-y-3 mb-4 p-4 bg-ds-muted rounded-lg">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <button
                      onClick={() => !cat.required && togglePreference(cat.id)}
                      disabled={cat.required}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        preferences[cat.id] || cat.required
                          ? "bg-ds-primary"
                          : "bg-ds-border"
                      } ${cat.required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                          preferences[cat.id] || cat.required ? "start-5" : "start-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ds-foreground">{t(locale, cat.title)}</span>
                      {cat.required && (
                        <span className="text-[10px] font-medium text-ds-muted-foreground bg-ds-muted px-1.5 py-0.5 rounded">
                          {t(locale, "identity.consent_required")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ds-muted-foreground mt-0.5">{t(locale, cat.description)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "identity.accept_all")}
            </button>
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm font-medium bg-ds-muted text-ds-foreground rounded-lg hover:bg-ds-background transition-colors border border-ds-border"
            >
              {t(locale, "identity.reject_all")}
            </button>
            {showDetails ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-ds-muted text-ds-foreground rounded-lg hover:bg-ds-background transition-colors border border-ds-border"
              >
                {t(locale, "identity.save_preferences")}
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm font-medium text-ds-muted-foreground hover:text-ds-foreground transition-colors"
              >
                {t(locale, "identity.consent_customize")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
