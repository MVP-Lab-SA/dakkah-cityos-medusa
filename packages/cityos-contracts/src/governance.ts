export interface CommercePolicies {
  vatRate: number
  restrictedCategories: string[]
  paymentProviders: string[]
  maxRefundDays: number
  requiresInvoice: boolean
  dataRetentionDays: number
  crossBorderAllowed: boolean
  localStorageRequired: boolean
  minimumDataClassification: string
}

export interface EffectivePolicies {
  dataResidency: Record<string, any>
  compliance: Record<string, any>
  dataHandling: Record<string, any>
  mandates: Record<string, any>
  commerce: Partial<CommercePolicies>
  sources: Array<{ level: string; name: string; id: string }>
}

export const RESIDENCY_ZONES = {
  GCC: { crossBorderAllowed: false, localStorageRequired: true, storageLocations: ["sa-east-1", "ae-east-1"], minimumClassification: "confidential" },
  EU: { crossBorderAllowed: false, localStorageRequired: true, storageLocations: ["eu-west-1", "eu-central-1"], minimumClassification: "confidential" },
  MENA: { crossBorderAllowed: true, localStorageRequired: true, storageLocations: ["me-south-1"], minimumClassification: "internal" },
  APAC: { crossBorderAllowed: true, localStorageRequired: false, storageLocations: ["ap-southeast-1", "ap-northeast-1"], minimumClassification: "internal" },
  AMERICAS: { crossBorderAllowed: true, localStorageRequired: false, storageLocations: ["us-east-1", "us-west-2"], minimumClassification: "internal" },
  GLOBAL: { crossBorderAllowed: true, localStorageRequired: false, storageLocations: ["us-east-1", "eu-west-1", "ap-southeast-1"], minimumClassification: "public" },
} as const

export type ResidencyZone = keyof typeof RESIDENCY_ZONES
