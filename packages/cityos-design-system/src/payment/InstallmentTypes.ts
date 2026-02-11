import type { BaseComponentProps } from "../components/ComponentTypes"

export interface InstallmentPlanInfo {
  id: string
  installments: number
  monthlyAmount: number
  totalAmount: number
  currency: string
  interestRate: number
  processingFee?: number
  firstPaymentDate?: string
  status?: "active" | "completed" | "overdue" | "cancelled"
}

export interface InstallmentScheduleEntry {
  number: number
  dueDate: string
  amount: number
  status: "paid" | "upcoming" | "overdue" | "cancelled"
  paidDate?: string
}

export interface InstallmentPlanCardProps extends BaseComponentProps {
  plan: InstallmentPlanInfo
  currency?: string
  onViewDetails?: (planId: string) => void
  locale?: string
}

export interface InstallmentScheduleProps extends BaseComponentProps {
  entries: InstallmentScheduleEntry[]
  currency?: string
  locale?: string
  loading?: boolean
}

export interface InstallmentCalculatorProps extends BaseComponentProps {
  total: number
  currency?: string
  availablePlans: number[]
  interestRates?: Record<number, number>
  onPlanSelect?: (installments: number) => void
  locale?: string
}
