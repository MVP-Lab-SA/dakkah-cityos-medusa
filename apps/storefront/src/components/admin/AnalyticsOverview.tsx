// @ts-nocheck

interface Metric {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: string
}

interface AnalyticsOverviewProps {
  metrics: Metric[]
  title?: string
}

const iconMap: Record<string, JSX.Element> = {
  revenue: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  orders: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  users: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  products: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  growth: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
}

export function AnalyticsOverview({ metrics, title }: AnalyticsOverviewProps) {
  return (
    <div>
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-ds-text-primary">{title}</h3>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-ds-border-primary bg-ds-bg-primary p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-ds-text-secondary">
                  {metric.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-ds-text-primary">
                  {metric.value}
                </p>
              </div>
              {metric.icon && iconMap[metric.icon] && (
                <div className="rounded-lg bg-ds-bg-secondary p-2 text-ds-text-secondary">
                  {iconMap[metric.icon]}
                </div>
              )}
            </div>

            {metric.change !== undefined && (
              <div className="mt-3 flex items-center gap-1.5">
                {metric.change >= 0 ? (
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change >= 0 ? "+" : ""}
                  {metric.change}%
                </span>
                {metric.changeLabel && (
                  <span className="text-sm text-ds-text-secondary">
                    {metric.changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
