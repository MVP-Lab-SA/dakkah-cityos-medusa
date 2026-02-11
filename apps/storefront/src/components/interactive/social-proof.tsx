import { useState, useEffect } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"

interface RecentPurchase {
  id: string
  customerName: string
  productName: string
  productImage?: string
  location?: string
  timeAgo: string
}

interface SocialProofProps {
  locale?: string
  viewerCount?: number
  recentPurchases?: RecentPurchase[]
  showViewers?: boolean
  showPurchasePopup?: boolean
  popupDuration?: number
  popupInterval?: number
}

export function SocialProof({
  locale: localeProp,
  viewerCount = 0,
  recentPurchases = [],
  showViewers = true,
  showPurchasePopup = true,
  popupDuration = 4000,
  popupInterval = 8000,
}: SocialProofProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [currentPurchase, setCurrentPurchase] = useState<RecentPurchase | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!showPurchasePopup || recentPurchases.length === 0) return
    let idx = 0
    const show = () => {
      setCurrentPurchase(recentPurchases[idx % recentPurchases.length])
      setIsVisible(true)
      idx++
      setTimeout(() => setIsVisible(false), popupDuration)
    }
    const timer = setInterval(show, popupInterval)
    const initialTimer = setTimeout(show, 2000)
    return () => {
      clearInterval(timer)
      clearTimeout(initialTimer)
    }
  }, [showPurchasePopup, recentPurchases, popupDuration, popupInterval])

  return (
    <>
      {showViewers && viewerCount > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ds-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ds-success" />
          </span>
          <span className="text-ds-muted">
            <span className="font-medium text-ds-text">{viewerCount}</span>{" "}
            {t(locale, "social.people_viewing")}
          </span>
        </div>
      )}

      {showPurchasePopup && currentPurchase && isVisible && (
        <div className="fixed bottom-4 start-4 z-50 animate-in slide-in-from-bottom-5 max-w-sm">
          <div className="bg-ds-card border border-ds-border rounded-lg shadow-lg p-3 flex items-start gap-3">
            {currentPurchase.productImage && (
              <img
                src={currentPurchase.productImage}
                alt={currentPurchase.productName}
                className="w-12 h-12 rounded object-cover bg-ds-accent flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ds-text">
                <span className="font-medium">{currentPurchase.customerName}</span>{" "}
                {t(locale, "social.just_purchased")}
              </p>
              <p className="text-sm font-medium text-ds-text truncate">{currentPurchase.productName}</p>
              <p className="text-xs text-ds-muted mt-0.5">
                {currentPurchase.timeAgo}
                {currentPurchase.location && ` · ${currentPurchase.location}`}
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 p-1 text-ds-muted hover:text-ds-text"
              aria-label={t(locale, "common.close")}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
