import React, { useState, useMemo } from 'react'

type TimePeriod = 'today' | '7d' | '30d' | '90d' | 'year'

interface AnalyticsOverviewProps {
  tenantId: string
  locale: string
  moduleKey?: string
}

interface StatData {
  label: string
  value: string
  change: number
  icon: React.ReactNode
  sparkline: number[]
}

const timePeriodLabels: Record<TimePeriod, string> = {
  today: 'Today',
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
  year: 'Year',
}

function generateMockSparkline(length: number, trend: 'up' | 'down' | 'flat'): number[] {
  const base = 50
  return Array.from({ length }, (_, i) => {
    const noise = Math.random() * 20 - 10
    const trendValue = trend === 'up' ? i * 3 : trend === 'down' ? -i * 2 : 0
    return Math.max(5, base + trendValue + noise)
  })
}

function getMockStats(period: TimePeriod, moduleKey?: string): StatData[] {
  const multiplier = period === 'today' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365

  const revenue = Math.round(1250 * multiplier + Math.random() * 500)
  const orders = Math.round(12 * multiplier + Math.random() * 10)
  const customers = Math.round(85 + multiplier * 2)
  const conversion = (2.4 + Math.random() * 1.5).toFixed(1)

  return [
    {
      label: 'Total Revenue',
      value: `$${revenue.toLocaleString()}`,
      change: 12.5,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      sparkline: generateMockSparkline(12, 'up'),
    },
    {
      label: moduleKey === 'bookings' ? 'Bookings Today' : 'Orders Today',
      value: orders.toLocaleString(),
      change: 8.2,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      sparkline: generateMockSparkline(12, 'up'),
    },
    {
      label: 'Active Customers',
      value: customers.toLocaleString(),
      change: 3.1,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      sparkline: generateMockSparkline(12, 'flat'),
    },
    {
      label: 'Conversion Rate',
      value: `${conversion}%`,
      change: -1.8,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      sparkline: generateMockSparkline(12, 'down'),
    },
  ]
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const width = 80
  const height = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  const areaPoints = `0,${height} ${points} ${width},${height}`

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon fill={`url(#grad-${color.replace('#', '')})`} points={areaPoints} />
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={points} />
    </svg>
  )
}

export function AnalyticsOverview({ tenantId, locale, moduleKey }: AnalyticsOverviewProps) {
  const [period, setPeriod] = useState<TimePeriod>('30d')

  const stats = useMemo(() => getMockStats(period, moduleKey), [period, moduleKey])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ds-foreground">Overview</h2>
        <div className="flex items-center gap-1 bg-ds-muted rounded-lg p-1">
          {(Object.keys(timePeriodLabels) as TimePeriod[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPeriod(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === key
                  ? 'bg-ds-card text-ds-foreground shadow-sm'
                  : 'text-ds-muted-foreground hover:text-ds-foreground'
              }`}
            >
              {timePeriodLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const sparkColor = stat.change >= 0 ? '#10b981' : '#ef4444'
          return (
            <div
              key={i}
              className="bg-ds-card border border-ds-border rounded-lg p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 bg-ds-primary/10 rounded-lg flex items-center justify-center text-ds-primary">
                  {stat.icon}
                </div>
                <Sparkline data={stat.sparkline} color={sparkColor} />
              </div>
              <div>
                <p className="text-2xl font-bold text-ds-foreground">{stat.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-ds-muted-foreground">{stat.label}</p>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      stat.change >= 0
                        ? 'bg-ds-success/10 text-ds-success'
                        : 'bg-ds-destructive/10 text-ds-destructive'
                    }`}
                  >
                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
