import { type ReactNode } from "react"
import { clsx } from "clsx"

interface StatCardProps {
  icon?: ReactNode
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
  description?: string
}

interface StatsGridProps {
  stats: StatCardProps[]
  columns?: 2 | 3 | 4
  className?: string
}

function StatCard({ icon, label, value, trend, description }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <span
            className={clsx(
              "text-xs font-medium",
              trend.positive ? "text-emerald-600" : "text-red-600"
            )}
          >
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}

const gridColsMap = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
}

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  return (
    <div className={clsx("grid grid-cols-1 gap-4", gridColsMap[columns], className)}>
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  )
}

export { StatCard }
export type { StatCardProps, StatsGridProps }
