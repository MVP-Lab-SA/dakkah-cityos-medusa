import { t } from "@/lib/i18n"
import { useTenant } from "@/lib/context/tenant-context"
import { clsx } from "clsx"

interface AgeVerificationStatusProps {
  status: "pending" | "verified" | "failed" | "expired"
  verifiedAt?: string
  expiresAt?: string
  minimumAge?: number
  method?: "dob" | "document"
  onRetry?: () => void
  locale?: string
  className?: string
}

const statusConfig: Record<string, { icon: string; colorClass: string; i18nKey: string }> = {
  pending: {
    icon: "⏳",
    colorClass: "bg-ds-warning/10 text-ds-warning border-ds-warning/20",
    i18nKey: "ageVerification.status_pending",
  },
  verified: {
    icon: "✅",
    colorClass: "bg-ds-success/10 text-ds-success border-ds-success/20",
    i18nKey: "ageVerification.status_verified",
  },
  failed: {
    icon: "❌",
    colorClass: "bg-ds-destructive/10 text-ds-destructive border-ds-destructive/20",
    i18nKey: "ageVerification.status_failed",
  },
  expired: {
    icon: "🕐",
    colorClass: "bg-ds-muted text-ds-muted-foreground border-ds-border",
    i18nKey: "ageVerification.status_expired",
  },
}

export function AgeVerificationStatus({
  status,
  verifiedAt,
  expiresAt,
  minimumAge,
  method,
  onRetry,
  locale: localeProp,
  className,
}: AgeVerificationStatusProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const config = statusConfig[status] || statusConfig.pending

  return (
    <div
      className={clsx(
        "rounded-lg border p-4",
        config.colorClass,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">
            {t(locale, config.i18nKey)}
          </h4>
          {minimumAge && (
            <p className="text-xs opacity-80 mt-0.5">
              {t(locale, "ageVerification.minimum_age").replace("{age}", String(minimumAge))}
            </p>
          )}
          {method && (
            <p className="text-xs opacity-80 mt-0.5">
              {t(locale, `ageVerification.method_${method}`)}
            </p>
          )}
          {verifiedAt && status === "verified" && (
            <p className="text-xs opacity-70 mt-1">
              {t(locale, "ageVerification.verified_on")} {new Date(verifiedAt).toLocaleDateString(locale)}
            </p>
          )}
          {expiresAt && (
            <p className="text-xs opacity-70 mt-0.5">
              {t(locale, "ageVerification.expires_on")} {new Date(expiresAt).toLocaleDateString(locale)}
            </p>
          )}
          {(status === "failed" || status === "expired") && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-medium underline hover:no-underline"
            >
              {t(locale, "ageVerification.retry")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
