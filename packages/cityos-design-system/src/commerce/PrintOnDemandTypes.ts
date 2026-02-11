import type { BaseComponentProps } from "../components/ComponentTypes"

export interface DesignUploaderProps extends BaseComponentProps {
  acceptedFormats?: string[]
  maxFileSize?: number
  onUpload?: (file: File) => void
  onRemove?: () => void
  previewUrl?: string
  uploading?: boolean
  error?: string
}

export interface MockupPreviewProps extends BaseComponentProps {
  productImage: string
  designImage?: string
  designPosition?: { x: number; y: number; width: number; height: number }
  productTitle: string
  variant?: string
  angle?: "front" | "back" | "left" | "right"
  onAngleChange?: (angle: "front" | "back" | "left" | "right") => void
}

export interface PrintAreaSelectorProps extends BaseComponentProps {
  areas: { id: string; name: string; width: number; height: number; maxDpi?: number }[]
  selectedAreaId?: string
  onSelect?: (areaId: string) => void
  productImage?: string
}

export interface PODProductCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  basePrice: { amount: number; currencyCode: string }
  category?: string
  printAreas?: number
  colors?: number
  sizes?: string[]
  onDesign?: () => void
}
