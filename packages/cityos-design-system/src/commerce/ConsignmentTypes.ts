import type { BaseComponentProps } from "../components/ComponentTypes"

export interface ConsignmentItemCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  askingPrice: { amount: number; currencyCode: string }
  commission: number
  status: "pending" | "listed" | "sold" | "returned"
  listedAt?: string
  soldAt?: string
  consignorName?: string
}

export interface ConsignorDashboardProps extends BaseComponentProps {
  totalItems: number
  listedItems: number
  soldItems: number
  totalEarnings: { amount: number; currencyCode: string }
  pendingPayout: { amount: number; currencyCode: string }
  items: ConsignmentItemCardProps[]
}

export interface ConsignmentSubmitFormProps extends BaseComponentProps {
  categories?: { id: string; name: string }[]
  onSubmit?: (data: {
    title: string
    description: string
    category: string
    askingPrice: number
    images: File[]
    condition: string
  }) => void
  submitting?: boolean
}
