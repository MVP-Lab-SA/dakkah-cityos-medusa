import { type ReactNode } from "react"
import { useTenant } from "@/lib/context/tenant-context"

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: { value: number; positive: boolean }
  locale?: string
}

export function StatsCard({ icon, label, value, trend, locale: localeProp }: StatsCardProps) {
  const { locale: ctxLocale } = useTenant()
  const _locale = localeProp || ctxLocale || "en"

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-ds-primary/10 rounded-lg flex items-center justify-center text-ds-primary">
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
        <p className="text-sm text-ds-muted mt-1">{label}</p>
      </div>
    </div>
  )
}
