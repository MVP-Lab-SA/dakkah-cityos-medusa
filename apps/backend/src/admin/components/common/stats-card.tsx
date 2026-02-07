import { Container, Heading, Text } from "@medusajs/ui"
import { ArrowUpRightMini, ArrowDownRightMini } from "@medusajs/icons"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
}

export function StatsCard({ title, value, change, changeLabel, icon }: StatsCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0
  
  return (
    <Container className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <Text size="small" className="text-ui-fg-subtle mb-1">
            {title}
          </Text>
          <Heading level="h2" className="text-2xl font-semibold">
            {value}
          </Heading>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && (
                <ArrowUpRightMini className="text-ui-tag-green-icon" />
              )}
              {isNegative && (
                <ArrowDownRightMini className="text-ui-tag-red-icon" />
              )}
              <Text 
                size="small" 
                className={
                  isPositive 
                    ? "text-ui-tag-green-text" 
                    : isNegative 
                      ? "text-ui-tag-red-text" 
                      : "text-ui-fg-subtle"
                }
              >
                {isPositive && "+"}
                {change}%
                {changeLabel && ` ${changeLabel}`}
              </Text>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-ui-bg-subtle rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </Container>
  )
}
