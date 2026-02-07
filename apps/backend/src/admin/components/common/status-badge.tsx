import { Badge } from "@medusajs/ui"
import { getStatusColor, formatStatusLabel } from "../../lib/formatters"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = getStatusColor(status)
  const label = formatStatusLabel(status)
  
  return (
    <Badge color={color}>
      {label}
    </Badge>
  )
}
