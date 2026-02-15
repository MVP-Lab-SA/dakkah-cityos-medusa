import React from 'react'

interface Stat {
  label: string
  value: string | number
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
}

interface StatsBlockProps {
  heading?: string
  stats: Stat[]
  variant?: 'default' | 'card' | 'inline' | 'icon'
  columns?: 2 | 3 | 4
  animated?: boolean
}

export const StatsBlock: React.FC<StatsBlockProps> = ({
  heading,
  stats,
  variant = 'default',
  columns = 4,
  animated = false,
}) => {
  if (!stats || !stats.length) return null

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  const renderStat = (stat: Stat, index: number) => {
    const valueContent = (
      <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground">
        {stat.prefix}{stat.value}{stat.suffix}
      </span>
    )

    if (variant === 'card') {
      return (
        <div
          key={index}
          className={`flex flex-col items-center gap-2 rounded-lg border border-ds-border bg-ds-card p-6 text-center ${animated ? 'transition-transform hover:scale-105' : ''}`}
        >
          {stat.icon && <div className="text-ds-primary mb-2">{stat.icon}</div>}
          {valueContent}
          <span className="text-sm text-ds-muted-foreground">{stat.label}</span>
          {stat.change && (
            <span className={`text-xs font-medium ${stat.change.type === 'increase' ? 'text-ds-success' : 'text-ds-destructive'}`}>
              {stat.change.type === 'increase' ? '+' : '-'}{Math.abs(stat.change.value)}%
            </span>
          )}
        </div>
      )
    }

    if (variant === 'inline') {
      return (
        <div key={index} className="flex items-center gap-4">
          {stat.icon && <div className="text-ds-primary">{stat.icon}</div>}
          <div>
            {valueContent}
            <span className="block text-sm text-ds-muted-foreground mt-1">{stat.label}</span>
          </div>
          {stat.change && (
            <span className={`text-xs font-medium ${stat.change.type === 'increase' ? 'text-ds-success' : 'text-ds-destructive'}`}>
              {stat.change.type === 'increase' ? '+' : '-'}{Math.abs(stat.change.value)}%
            </span>
          )}
        </div>
      )
    }

    if (variant === 'icon') {
      return (
        <div
          key={index}
          className={`flex flex-col items-center gap-3 text-center ${animated ? 'transition-transform hover:scale-105' : ''}`}
        >
          {stat.icon && (
            <div className="w-12 h-12 rounded-full bg-ds-primary/10 flex items-center justify-center text-ds-primary">
              {stat.icon}
            </div>
          )}
          {valueContent}
          <span className="text-sm text-ds-muted-foreground">{stat.label}</span>
          {stat.change && (
            <span className={`text-xs font-medium ${stat.change.type === 'increase' ? 'text-ds-success' : 'text-ds-destructive'}`}>
              {stat.change.type === 'increase' ? '+' : '-'}{Math.abs(stat.change.value)}%
            </span>
          )}
        </div>
      )
    }

    return (
      <div
        key={index}
        className={`flex flex-col items-center gap-2 text-center ${animated ? 'transition-transform hover:scale-105' : ''}`}
      >
        {valueContent}
        <span className="text-sm text-ds-muted-foreground">{stat.label}</span>
        {stat.change && (
          <span className={`text-xs font-medium ${stat.change.type === 'increase' ? 'text-ds-success' : 'text-ds-destructive'}`}>
            {stat.change.type === 'increase' ? '+' : '-'}{Math.abs(stat.change.value)}%
          </span>
        )}
      </div>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground text-center mb-8 md:mb-12">
            {heading}
          </h2>
        )}
        <div className={`grid gap-6 md:gap-8 ${gridCols[columns]}`}>
          {stats.map((stat, i) => renderStat(stat, i))}
        </div>
      </div>
    </section>
  )
}
