import { useState, useEffect } from "react"
import { t } from "@/lib/i18n"
import { useParams } from "@tanstack/react-router"

interface AgeGateProps {
  minimumAge?: number
  method?: "dob" | "checkbox"
  onVerified: () => void
  onDenied?: () => void
  children: React.ReactNode
}

const STORAGE_KEY = "age_verified"

export function AgeGate({
  minimumAge = 18,
  method = "dob",
  onVerified,
  onDenied,
  children,
}: AgeGateProps) {
  const { locale } = useParams({ strict: false }) as { locale: string }
  const [mounted, setMounted] = useState(false)
  const [verified, setVerified] = useState(false)
  const [dobValue, setDobValue] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored === "true") {
        setVerified(true)
        onVerified()
      }
    } catch {}
  }, [])

  if (!mounted) {
    return null
  }

  if (verified) {
    return <>{children}</>
  }

  const handleDobSubmit = () => {
    if (!dobValue) {
      setError(t(locale, "identity.please_enter_dob"))
      return
    }
    const dob = new Date(dobValue)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    if (age >= minimumAge) {
      setVerified(true)
      try { sessionStorage.setItem(STORAGE_KEY, "true") } catch {}
      onVerified()
    } else {
      setError(t(locale, "identity.minimum_age_required_desc").replace("{age}", String(minimumAge)))
      onDenied?.()
    }
  }

  const handleCheckbox = () => {
    setVerified(true)
    try { sessionStorage.setItem(STORAGE_KEY, "true") } catch {}
    onVerified()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-ds-background rounded-xl border border-ds-border p-8 text-center">
        <span className="text-4xl block mb-4">🔒</span>
        <h2 className="text-xl font-bold text-ds-foreground mb-2">
          {t(locale, "identity.age_verification")}
        </h2>
        <p className="text-sm text-ds-muted-foreground mb-6">
          {t(locale, "identity.minimum_age_required_desc").replace("{age}", String(minimumAge))}
        </p>

        {method === "dob" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1 text-start">
                {t(locale, "identity.date_of_birth")}
              </label>
              <input
                type="date"
                value={dobValue}
                onChange={(e) => {
                  setDobValue(e.target.value)
                  setError("")
                }}
                className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>
            {error && (
              <p className="text-sm text-ds-destructive">{error}</p>
            )}
            <button
              onClick={handleDobSubmit}
              className="w-full px-4 py-2.5 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "identity.verify_identity")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleCheckbox}
              className="w-full px-4 py-2.5 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "blocks.yes")}, I am {minimumAge}+
            </button>
            <button
              onClick={() => onDenied?.()}
              className="w-full px-4 py-2.5 text-sm font-medium bg-ds-muted text-ds-foreground rounded-lg hover:bg-ds-background transition-colors"
            >
              {t(locale, "blocks.no")}, I am under {minimumAge}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
