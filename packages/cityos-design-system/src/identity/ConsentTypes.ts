import type { BaseComponentProps } from "../components/ComponentTypes"

export interface ConsentCategoryInfo {
  id: string
  title: string
  description: string
  required: boolean
  defaultEnabled: boolean
}

export interface CookieConsentBannerProps extends BaseComponentProps {
  categories: ConsentCategoryInfo[]
  onAcceptAll: () => void
  onRejectAll?: () => void
  onSavePreferences: (preferences: Record<string, boolean>) => void
  showPreferences?: boolean
  privacyPolicyUrl?: string
  position?: "bottom" | "top" | "center"
  locale?: string
}

export interface ConsentPreferencesProps extends BaseComponentProps {
  categories: ConsentCategoryInfo[]
  currentPreferences: Record<string, boolean>
  onSave: (preferences: Record<string, boolean>) => void
  onCancel: () => void
  locale?: string
}

export interface PrivacySettingsProps extends BaseComponentProps {
  categories: ConsentCategoryInfo[]
  currentPreferences: Record<string, boolean>
  onSave: (preferences: Record<string, boolean>) => void
  dataRetentionDays?: number
  showDeleteAccount?: boolean
  onDeleteAccount?: () => void
  locale?: string
}

export interface ConsentToggleProps extends BaseComponentProps {
  id: string
  label: string
  description?: string
  enabled: boolean
  required?: boolean
  onChange: (id: string, enabled: boolean) => void
  locale?: string
}
