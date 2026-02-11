import { type ReactNode } from "react"

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
  description?: string
}

interface StatsGridProps {
  stats: StatCardProps[]
  className?: string
}

function StatCard({ icon, label, value, trend, description }: StatCardProps) {
  return (
    <div className="bg-ds-card border border-ds-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-ds-primary/10 flex items-center justify-center text-ds-primary">
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.positive
                ? "bg-ds-success/10 text-ds-success"
                : "bg-ds-destructive/10 text-ds-destructive"
            }`}
          >
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-ds-text">{value}</p>
        <p className="text-sm text-ds-muted-foreground mt-1">{label}</p>
        {description && (
          <p className="text-xs text-ds-muted-foreground mt-1">{description}</p>
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
