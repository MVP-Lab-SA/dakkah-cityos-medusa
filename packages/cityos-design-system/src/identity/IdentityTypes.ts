import type { BaseComponentProps } from "../components/ComponentTypes"

export interface KYCFormProps extends BaseComponentProps {
  currentStep: number
  totalSteps: number
  onSubmit: (data: KYCSubmission) => void
  onBack?: () => void
  onCancel?: () => void
}

export interface KYCSubmission {
  fullName: string
  dateOfBirth: string
  nationality: string
  documentType: "passport" | "national-id" | "drivers-license"
  documentNumber: string
  documentFront?: File
  documentBack?: File
  selfie?: File
  address?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
}

export interface VerificationStatusProps extends BaseComponentProps {
  status: "not-started" | "pending" | "verified" | "rejected" | "expired"
  type: "kyc" | "age" | "residency" | "identity"
  submittedAt?: string
  verifiedAt?: string
  rejectionReason?: string
  onResubmit?: () => void
}

export interface DocumentUploadProps extends BaseComponentProps {
  label: string
  acceptedTypes: string[]
  maxSize?: number
  preview?: string
  onUpload: (file: File) => void
  onRemove?: () => void
  status?: "idle" | "uploading" | "uploaded" | "error"
  error?: string
}

export interface AgeGateProps extends BaseComponentProps {
  minimumAge: number
  onVerified: () => void
  onDenied?: () => void
  method?: "dob" | "checkbox" | "document"
  title?: string
  description?: string
}

export interface ConsentBannerProps extends BaseComponentProps {
  categories: ConsentCategory[]
  onAcceptAll: () => void
  onRejectAll?: () => void
  onSavePreferences: (preferences: Record<string, boolean>) => void
  showPreferences?: boolean
  privacyPolicyUrl?: string
  position?: "bottom" | "top" | "center"
}

export interface ConsentCategory {
  id: string
  title: string
  description: string
  required: boolean
  defaultEnabled: boolean
}

export interface ConsentPreferencesProps extends BaseComponentProps {
  categories: ConsentCategory[]
  currentPreferences: Record<string, boolean>
  onSave: (preferences: Record<string, boolean>) => void
  onCancel: () => void
}

export interface CredentialCardProps extends BaseComponentProps {
  credentialType: "kyc" | "vendor" | "membership" | "tenant-operator" | "poi" | "marketplace-seller"
  issuer: string
  issuedAt: string
  expiresAt?: string
  status: "valid" | "expired" | "revoked"
  claims?: Record<string, string>
  onPresent?: () => void
  onRevoke?: () => void
}

export interface VerificationBadgeProps extends BaseComponentProps {
  verified: boolean
  type?: "identity" | "business" | "seller" | "premium"
  tooltip?: string
  size?: "sm" | "md" | "lg"
}
