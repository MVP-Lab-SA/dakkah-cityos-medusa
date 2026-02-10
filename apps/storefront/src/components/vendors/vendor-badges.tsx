import { Check, Star, ShieldCheck, Bolt } from "@medusajs/icons"
import { cn } from "@/lib/utils/cn"

type BadgeType = "verified" | "top_seller" | "fast_shipper" | "responsive" | "trusted"

interface VendorBadgesProps {
  badges: BadgeType[]
  size?: "sm" | "md" | "lg"
}

const badgeConfig: Record<BadgeType, { label: string; icon: React.ElementType; color: string }> = {
  verified: {
    label: "Verified Seller",
    icon: Check,
    color: "bg-ds-info text-ds-info",
  },
  top_seller: {
    label: "Top Seller",
    icon: Star,
    color: "bg-ds-warning text-ds-warning",
  },
  fast_shipper: {
    label: "Fast Shipper",
    icon: Bolt,
    color: "bg-ds-success text-ds-success",
  },
  responsive: {
    label: "Quick Responder",
    icon: Check,
    color: "bg-ds-accent/10 text-ds-accent",
  },
  trusted: {
    label: "Trusted Vendor",
    icon: ShieldCheck,
    color: "bg-ds-muted text-ds-foreground",
  },
}

export function VendorBadges({ badges, size = "md" }: VendorBadgesProps) {
  if (badges.length === 0) return null

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        const config = badgeConfig[badge]
        if (!config) return null

        return (
          <span
            key={badge}
            className={cn(
              "inline-flex items-center rounded-full font-medium",
              config.color,
              sizeClasses[size]
            )}
          >
            <config.icon className={iconSizes[size]} />
            {config.label}
          </span>
        )
      })}
    </div>
  )
}
