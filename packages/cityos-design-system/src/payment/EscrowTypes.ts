import type { BaseComponentProps } from "../components/ComponentTypes"

export interface EscrowEvent {
  id: string
  status: string
  timestamp: string
  description: string
  actor?: string
}

export interface EscrowStatusCardProps extends BaseComponentProps {
  escrowId: string
  amount: number
  currency?: string
  status: "held" | "released" | "disputed" | "refunded"
  heldSince?: string
  releaseDate?: string
  parties: { buyer: string; seller: string }
  locale?: string
}

export interface EscrowTimelineProps extends BaseComponentProps {
  events: EscrowEvent[]
  currentStatus: "held" | "released" | "disputed" | "refunded"
  locale?: string
  loading?: boolean
}

export interface EscrowReleaseFormProps extends BaseComponentProps {
  escrowId: string
  amount: number
  currency?: string
  onRelease: (data: { escrowId: string; notes?: string }) => void
  onDispute?: () => void
  onCancel: () => void
  locale?: string
  loading?: boolean
}
