import { ShoppingBag, Star, User } from "@medusajs/icons"

interface VendorStatsProps {
  productCount: number
  rating?: number
  reviewCount?: number
  salesCount?: number
}

export function VendorStats({ productCount, rating, reviewCount, salesCount }: VendorStatsProps) {
  const stats = [
    {
      label: "Products",
      value: productCount.toLocaleString(),
      icon: ShoppingBag,
    },
    ...(rating !== undefined ? [{
      label: "Rating",
      value: rating.toFixed(1),
      icon: Star,
      suffix: reviewCount ? `(${reviewCount} reviews)` : undefined,
    }] : []),
    ...(salesCount !== undefined ? [{
      label: "Sales",
      value: salesCount.toLocaleString(),
      icon: User,
    }] : []),
  ]

  return (
    <div className="flex flex-wrap gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
            <stat.icon className="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="font-semibold text-zinc-900">
              {stat.value}
              {stat.suffix && (
                <span className="text-sm font-normal text-zinc-500 ml-1">{stat.suffix}</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
