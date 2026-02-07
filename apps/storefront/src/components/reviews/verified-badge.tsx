import { CheckCircleSolid } from "@medusajs/icons"

interface VerifiedBadgeProps {
  isVerified: boolean
  className?: string
}

export function VerifiedBadge({ isVerified, className = "" }: VerifiedBadgeProps) {
  if (!isVerified) return null

  return (
    <span 
      className={`inline-flex items-center gap-1 text-xs font-medium text-green-700 ${className}`}
      title="This reviewer purchased this product"
    >
      <CheckCircleSolid className="w-3.5 h-3.5" />
      Verified Purchase
    </span>
  )
}
