// @ts-nocheck
import { useState, useEffect } from "react"
import { t } from "../../lib/i18n"

const CONSENT_KEY = "cookie_consent"

interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

interface CookieConsentBannerProps {
  locale: string
}

function CookieConsentBanner({ locale }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (!stored) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const saveConsent = (prefs: ConsentPreferences) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
    } catch {}
    setVisible(false)
  }

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true, preferences: true })
  }

  const handleRejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, marketing: false, preferences: false })
  }

  const handleSaveCustom = () => {
    saveConsent({ ...preferences, essential: true })
  }

  const toggleCategory = (key: keyof ConsentPreferences) => {
    if (key === "essential") return
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (!visible) return null

  const categories: Array<{
    key: keyof ConsentPreferences
    label: string
    description: string
    required: boolean
  }> = [
    {
      key: "essential",
      label: t(locale, "consent.essential"),
      description: t(locale, "consent.essential_desc"),
      required: true,
    },
    {
      key: "analytics",
      label: t(locale, "consent.analytics"),
      description: t(locale, "consent.analytics_desc"),
      required: false,
    },
    {
      key: "marketing",
      label: t(locale, "consent.marketing"),
      description: t(locale, "consent.marketing_desc"),
      required: false,
    },
    {
      key: "preferences",
      label: t(locale, "consent.preferences"),
      description: t(locale, "consent.preferences_desc"),
      required: false,
    },
  ]

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="max-w-2xl mx-auto bg-ds-card border border-ds-border rounded-xl shadow-lg overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-ds-primary/10 rounded-full flex-shrink-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ds-foreground">
                {t(locale, "consent.cookie_title")}
              </h3>
              <p className="text-xs text-ds-muted-foreground mt-1">
                {t(locale, "consent.cookie_description")}
              </p>
            </div>
          </div>

          {showCustomize && (
            <div className="space-y-3 mb-4 border-t border-ds-border pt-4">
              {categories.map((cat) => (
                <div key={cat.key} className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <button
                      onClick={() => toggleCategory(cat.key)}
                      disabled={cat.required}
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        preferences[cat.key] || cat.required
                          ? "bg-ds-primary"
                          : "bg-ds-border"
                      } ${cat.required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                      role="switch"
                      aria-checked={preferences[cat.key]}
                      aria-label={cat.label}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                          preferences[cat.key] || cat.required ? "start-5" : "start-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ds-foreground">{cat.label}</span>
                      {cat.required && (
                        <span className="text-[10px] font-medium text-ds-muted-foreground bg-ds-muted px-1.5 py-0.5 rounded">
                          {t(locale, "consent.required")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ds-muted-foreground mt-0.5">{cat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "consent.accept_all")}
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="px-4 py-2 text-sm font-medium border border-ds-border text-ds-foreground rounded-lg hover:bg-ds-muted transition-colors"
            >
              {t(locale, "consent.reject_non_essential")}
            </button>
            {showCustomize ? (
              <button
                onClick={handleSaveCustom}
                className="px-4 py-2 text-sm font-medium bg-ds-success text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                {t(locale, "consent.save_preferences")}
              </button>
            ) : (
              <button
                onClick={() => setShowCustomize(true)}
                className="px-4 py-2 text-sm font-medium text-ds-primary hover:underline"
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

export default CookieConsentBanner
