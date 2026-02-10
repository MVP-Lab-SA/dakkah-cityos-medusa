import { useState } from "react"
import { useParams } from "@tanstack/react-router"
import { t } from "@/lib/i18n"

interface VerificationBadgeProps {
  verified: boolean
  type?: "identity" | "business" | "seller" | "premium"
  tooltip?: string
  size?: "sm" | "md" | "lg"
}

const typeColorMap: Record<string, string> = {
  identity: "text-ds-primary",
  business: "text-blue-500",
  seller: "text-ds-success",
  premium: "text-ds-warning",
}

const sizeMap: Record<string, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

export function VerificationBadge({
  verified,
  type = "identity",
  tooltip,
  size = "md",
}: VerificationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const { locale } = useParams({ strict: false }) as { locale: string }

  if (!verified) return null

  const typeColorMap_key: Record<string, string> = {
    identity: "identity.verified_identity",
    business: "identity.verified_business",
    seller: "identity.verified_seller",
    premium: "identity.premium_verified",
  }
  
  const color = typeColorMap[type] || typeColorMap.identity
  const iconSize = sizeMap[size] || sizeMap.md
  const labelKey = typeColorMap_key[type] || typeColorMap_key.identity
  const tooltipText = tooltip || t(locale, labelKey)

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <svg
        className={`${iconSize} ${color}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      {showTooltip && (
        <span className="absolute bottom-full start-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[11px] font-medium text-white bg-ds-foreground rounded whitespace-nowrap z-10 pointer-events-none">
          {tooltipText}
          <span className="absolute top-full start-1/2 -translate-x-1/2 border-4 border-transparent border-t-ds-foreground" />
        </span>
      )}
    </span>
  )
}
