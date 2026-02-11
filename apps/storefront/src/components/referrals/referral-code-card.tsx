import { useState, useEffect, useCallback } from "react"
import { t } from "../../lib/i18n"
import { useTenant } from "../../lib/context/tenant-context"
import type { ReferralCodeCardProps } from "@cityos/design-system"

export function ReferralCodeCard({
  code,
  link,
  rewardDescription,
  locale: localeProp,
  className,
}: ReferralCodeCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [copiedField, setCopiedField] = useState<"code" | "link" | null>(null)
  const [canCopy, setCanCopy] = useState(false)

  useEffect(() => {
    setCanCopy(typeof navigator !== "undefined" && !!navigator.clipboard)
  }, [])

  const handleCopy = useCallback(async (text: string, field: "code" | "link") => {
    if (!canCopy) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
    }
  }, [canCopy])

  const shareUrl = encodeURIComponent(link)
  const shareText = encodeURIComponent(rewardDescription || "")

  return (
    <div className={`bg-ds-background border border-ds-border rounded-lg p-4 md:p-6 ${className || ""}`}>
      <h3 className="font-semibold text-ds-foreground mb-1">
        {t(locale, "referral.title")}
      </h3>
      {rewardDescription && (
        <p className="text-sm text-ds-muted-foreground mb-4">{rewardDescription}</p>
      )}

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-ds-foreground block mb-1.5">
            {t(locale, "referral.your_code")}
          </label>
          <div className="flex">
            <input
              type="text"
              value={code}
              readOnly
              className="flex-1 px-3 py-2 bg-ds-muted border border-ds-border rounded-s-lg text-sm text-ds-foreground font-mono"
            />
            <button
              type="button"
              onClick={() => handleCopy(code, "code")}
              disabled={!canCopy}
              className="px-4 py-2 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-e-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {copiedField === "code" ? t(locale, "referral.copied") : t(locale, "referral.copy")}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ds-foreground block mb-1.5">
            {t(locale, "referral.your_link")}
          </label>
          <div className="flex">
            <input
              type="text"
              value={link}
              readOnly
              className="flex-1 px-3 py-2 bg-ds-muted border border-ds-border rounded-s-lg text-sm text-ds-foreground font-mono truncate"
            />
            <button
              type="button"
              onClick={() => handleCopy(link, "link")}
              disabled={!canCopy}
              className="px-4 py-2 bg-ds-primary text-ds-primary-foreground text-sm font-medium rounded-e-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {copiedField === "link" ? t(locale, "referral.copied") : t(locale, "referral.copy")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-ds-foreground mb-2">
          {t(locale, "referral.share_via")}
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-ds-muted text-ds-foreground hover:bg-ds-muted/80 transition-colors"
          >
            X / Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-ds-muted text-ds-foreground hover:bg-ds-muted/80 transition-colors"
          >
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-ds-muted text-ds-foreground hover:bg-ds-muted/80 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${shareText}&body=${shareUrl}`}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-ds-muted text-ds-foreground hover:bg-ds-muted/80 transition-colors"
          >
            {t(locale, "referral.email")}
          </a>
        </div>
      </div>
    </div>
  )
}
