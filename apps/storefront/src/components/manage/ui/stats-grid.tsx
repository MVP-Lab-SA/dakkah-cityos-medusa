import { type ReactNode } from "react"

interface StatCardProps {
  icon?: ReactNode
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
  description?: string
}

interface StatsGridProps {
  stats: StatCardProps[]
  className?: string
}

function StatCard({ label, value, trend }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.positive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
    </div>
  )
}

export function StatsGrid({ stats, className = "" }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  )
}

export { StatCard }
export type { StatCardProps, StatsGridProps }
