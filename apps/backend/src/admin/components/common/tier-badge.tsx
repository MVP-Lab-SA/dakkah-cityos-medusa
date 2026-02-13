import { Badge } from "@medusajs/ui"
import { getTierInfo } from "../../lib/formatters.js"

interface TierBadgeProps {
  tier: string
}

export function TierBadge({ tier }: TierBadgeProps) {
  const { label, color } = getTierInfo(tier)
  
  return (
    <Badge 
      style={{ 
        backgroundColor: `${color}20`, 
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      {label}
    </Badge>
  )
}
