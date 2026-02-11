import React, { type ReactNode } from "react"
import { t } from "@/lib/i18n"
import { StatsGrid } from "@/components/manage/ui/stats-grid"
import {
  CurrencyDollar,
  ShoppingCart,
  Tag,
  Users,
  ChartBar,
} from "@medusajs/icons"

interface ManageStatsBlockProps {
  heading?: string
  stats: Array<{
    label: string
    value: string | number
    trend?: { value: number; positive: boolean }
    icon?: "revenue" | "orders" | "products" | "customers" | "conversion"
  }>
  columns?: 2 | 3 | 4
  locale?: string
}

const iconMap: Record<string, ReactNode> = {
  revenue: <CurrencyDollar className="w-5 h-5" />,
  orders: <ShoppingCart className="w-5 h-5" />,
  products: <Tag className="w-5 h-5" />,
  customers: <Users className="w-5 h-5" />,
  conversion: <ChartBar className="w-5 h-5" />,
}

const gridColsMap: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

export const ManageStatsBlock: React.FC<ManageStatsBlockProps> = ({
  heading,
  stats,
  columns = 4,
  locale = "en",
}) => {
  const mappedStats = stats.map((stat) => ({
    icon: stat.icon ? iconMap[stat.icon] || null : null,
    label: stat.label,
    value: stat.value,
    trend: stat.trend,
  }))

  return (
    <section className="py-6">
      {heading && (
        <h2 className="text-lg font-semibold text-ds-text mb-4">
          {heading}
        </h2>
      )}
      <StatsGrid stats={mappedStats} className={gridColsMap[columns] || gridColsMap[4]} />
    </section>
  )
}
