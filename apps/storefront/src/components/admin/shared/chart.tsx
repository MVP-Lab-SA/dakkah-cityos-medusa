import React from 'react'

interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

interface BaseChartProps {
  data: ChartDataPoint[]
  width?: number
  height?: number
  title?: string
  showLegend?: boolean
}

const defaultColors = [
  'var(--ds-primary, #3b82f6)',
  'var(--ds-destructive, #ef4444)',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
]

function getColor(index: number, custom?: string): string {
  return custom || defaultColors[index % defaultColors.length]
}

function ChartLegend({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs text-ds-muted-foreground">
          <span
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: getColor(i, item.color) }}
          />
          {item.label}
        </div>
      ))}
    </div>
  )
}

export const LineChart: React.FC<BaseChartProps> = ({
  data,
  width = 400,
  height = 250,
  title,
  showLegend = false,
}) => {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1
  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - ((d.value - minValue) / range) * chartH,
  }))

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  const yTicks = 5
  const yLabels = Array.from({ length: yTicks }, (_, i) => {
    const val = minValue + (range / (yTicks - 1)) * i
    return { value: val, y: padding.top + chartH - (i / (yTicks - 1)) * chartH }
  })

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4">
      {title && <h3 className="text-sm font-semibold text-ds-foreground mb-3">{title}</h3>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxWidth: width }}>
        {yLabels.map((tick, i) => (
          <g key={i}>
            <line x1={padding.left} y1={tick.y} x2={width - padding.right} y2={tick.y} stroke="currentColor" className="text-ds-border" strokeWidth={0.5} />
            <text x={padding.left - 8} y={tick.y + 4} textAnchor="end" className="text-ds-muted-foreground" fontSize={10} fill="currentColor">
              {Math.round(tick.value)}
            </text>
          </g>
        ))}
        <polyline fill="none" stroke={getColor(0, data[0]?.color)} strokeWidth={2} points={polylinePoints} />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={getColor(i, data[i]?.color)} stroke="white" strokeWidth={2} />
            <text x={p.x} y={height - 8} textAnchor="middle" className="text-ds-muted-foreground" fontSize={9} fill="currentColor">
              {data[i].label}
            </text>
          </g>
        ))}
      </svg>
      {showLegend && <ChartLegend data={data} />}
    </div>
  )
}

export const BarChart: React.FC<BaseChartProps> = ({
  data,
  width,
  height = 250,
  title,
  showLegend = false,
}) => {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value)) || 1

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4" style={width ? { maxWidth: width } : undefined}>
      {title && <h3 className="text-sm font-semibold text-ds-foreground mb-3">{title}</h3>}
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1" style={{ height: '100%' }}>
              <span className="text-xs text-ds-muted-foreground font-medium">{item.value}</span>
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: getColor(i, item.color),
                    minHeight: 4,
                  }}
                />
              </div>
              <span className="text-xs text-ds-muted-foreground truncate max-w-full" title={item.label}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
      {showLegend && <ChartLegend data={data} />}
    </div>
  )
}

export const PieChart: React.FC<BaseChartProps> = ({
  data,
  width = 250,
  height = 250,
  title,
  showLegend = true,
}) => {
  if (data.length === 0) return null

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const size = Math.min(width, height)
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 10

  let cumulativeAngle = -90

  const segments = data.map((item, i) => {
    const angle = (item.value / total) * 360
    const startAngle = cumulativeAngle
    const endAngle = cumulativeAngle + angle
    cumulativeAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

    return { d, color: getColor(i, item.color), label: item.label, value: item.value, pct: ((item.value / total) * 100).toFixed(1) }
  })

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-4" style={{ maxWidth: width + 100 }}>
      {title && <h3 className="text-sm font-semibold text-ds-foreground mb-3">{title}</h3>}
      <div className="flex items-center gap-4">
        <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }} className="flex-shrink-0">
          {segments.map((seg, i) => (
            <path key={i} d={seg.d} fill={seg.color} stroke="white" strokeWidth={2} />
          ))}
        </svg>
      </div>
      {showLegend && (
        <div className="flex flex-wrap gap-2 mt-3">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-ds-muted-foreground">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
              {seg.label} ({seg.pct}%)
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
