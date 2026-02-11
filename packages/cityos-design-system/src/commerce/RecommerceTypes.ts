import type { BaseComponentProps } from "../components/ComponentTypes"

export interface ConditionGraderProps extends BaseComponentProps {
  conditions: { value: string; label: string; description?: string; multiplier: number }[]
  selectedCondition?: string
  onSelect?: (condition: string) => void
}

export interface TradeInCalculatorProps extends BaseComponentProps {
  baseValue: { amount: number; currencyCode: string }
  condition: string
  multiplier: number
  estimatedValue: { amount: number; currencyCode: string }
  disclaimer?: string
  onSubmit?: () => void
}

export interface TradeInItemCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  estimatedValue: { amount: number; currencyCode: string }
  condition: "excellent" | "good" | "fair" | "poor"
  status: "pending" | "evaluated" | "accepted" | "rejected"
  submittedAt?: string
  evaluatedAt?: string
  onViewDetails?: () => void
}
