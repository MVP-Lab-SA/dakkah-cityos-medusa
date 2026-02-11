import type { BaseComponentProps } from "../components/ComponentTypes"

export interface AgeGateProps extends BaseComponentProps {
  minimumAge: number
  onVerified: () => void
  onDenied?: () => void
  method?: "dob" | "checkbox" | "document"
  title?: string
  description?: string
  locale?: string
}

export interface AgeVerificationStatusProps extends BaseComponentProps {
  status: "pending" | "verified" | "failed" | "expired"
  verifiedAt?: string
  expiresAt?: string
  minimumAge?: number
  method?: "dob" | "document"
  onRetry?: () => void
  locale?: string
}

export interface AgeVerificationFormProps extends BaseComponentProps {
  minimumAge: number
  onSubmit: (data: { method: "dob" | "document"; dob?: string; document?: File }) => void
  onCancel?: () => void
  allowedMethods?: ("dob" | "document")[]
  isSubmitting?: boolean
  locale?: string
}

export interface DOBVerifierProps extends BaseComponentProps {
  minimumAge: number
  onVerified: (dob: string) => void
  onDenied?: () => void
  showAge?: boolean
  locale?: string
}
