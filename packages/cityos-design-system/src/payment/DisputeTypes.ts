import type { BaseComponentProps } from "../components/ComponentTypes"

export interface DisputeInfo {
  id: string
  orderId: string
  reason: string
  description: string
  status: "open" | "under_review" | "resolved" | "rejected" | "escalated"
  createdAt: string
  updatedAt: string
  amount: number
  currency: string
  resolution?: string
}

export interface DisputeEvent {
  id: string
  status: string
  timestamp: string
  description: string
  actor?: string
}

export interface DisputeCardProps extends BaseComponentProps {
  dispute: DisputeInfo
  onViewDetails?: (disputeId: string) => void
  locale?: string
}

export interface DisputeFormComponentProps extends BaseComponentProps {
  orderId: string
  reasons: string[]
  onSubmit: (data: { reason: string; description: string; evidence?: File[] }) => void
  onCancel: () => void
  locale?: string
  loading?: boolean
}

export interface RefundTrackerProps extends BaseComponentProps {
  refundId: string
  amount: number
  currency?: string
  status: "requested" | "processing" | "completed" | "denied"
  method: "original" | "store-credit" | "wallet"
  requestedAt: string
  completedAt?: string
  timeline?: { status: string; timestamp: string }[]
  locale?: string
}

export interface EvidenceUploaderProps extends BaseComponentProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string
  locale?: string
}

export interface DisputeTimelineProps extends BaseComponentProps {
  events: DisputeEvent[]
  currentStatus: string
  locale?: string
  loading?: boolean
}
