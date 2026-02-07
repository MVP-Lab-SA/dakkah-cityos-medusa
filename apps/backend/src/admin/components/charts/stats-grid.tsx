import { Container, Heading, Text } from "@medusajs/ui"
import { ArrowUpRightMini, ArrowDownRightMini } from "@medusajs/icons"

type Stat = {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: "default" | "green" | "red" | "blue" | "orange" | "purple"
}

type StatsGridProps = {
  stats: Stat[]
  columns?: 2 | 3 | 4 | 5
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  }[columns]

  const colorClasses = {
    default: "bg-ui-bg-base",
    green: "bg-ui-tag-green-bg",
    red: "bg-ui-tag-red-bg",
    blue: "bg-ui-tag-blue-bg",
    orange: "bg-ui-tag-orange-bg",
    purple: "bg-ui-tag-purple-bg",
  }

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {stats.map((stat, idx) => (
        <Container
          key={idx}
          className={`p-4 ${colorClasses[stat.color || "default"]}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <Text className="text-ui-fg-muted text-sm">{stat.label}</Text>
              <Heading level="h2" className="text-2xl font-semibold mt-1">
                {stat.value}
              </Heading>
              {stat.change !== undefined && (
                <div className="flex items-center gap-1 mt-2">
                  {stat.change >= 0 ? (
                    <ArrowUpRightMini className="w-4 h-4 text-ui-tag-green-text" />
                  ) : (
                    <ArrowDownRightMini className="w-4 h-4 text-ui-tag-red-text" />
                  )}
                  <Text
                    className={`text-sm ${
                      stat.change >= 0
                        ? "text-ui-tag-green-text"
                        : "text-ui-tag-red-text"
                    }`}
                  >
                    {stat.change >= 0 ? "+" : ""}
                    {stat.change}%
                  </Text>
                  {stat.changeLabel && (
                    <Text className="text-ui-fg-muted text-sm ml-1">
                      {stat.changeLabel}
                    </Text>
                  )}
                </div>
              )}
            </div>
            {stat.icon && (
              <div className="p-2 rounded-lg bg-ui-bg-subtle">{stat.icon}</div>
            )}
          </div>
        </Container>
      ))}
    </div>
  )
}
