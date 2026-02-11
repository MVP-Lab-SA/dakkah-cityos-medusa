import type { BaseComponentProps } from "../components/ComponentTypes"

export interface WhiteLabelProductCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  basePrice: { amount: number; currencyCode: string }
  minOrderQuantity?: number
  customizable?: boolean
  category?: string
  brandName?: string
  onCustomize?: () => void
  onRequestQuote?: () => void
}

export interface BrandCustomizerProps extends BaseComponentProps {
  productId: string
  brandName?: string
  logoUrl?: string
  colorScheme?: { primary: string; secondary: string; accent: string }
  fontFamily?: string
  onBrandNameChange?: (name: string) => void
  onLogoUpload?: (file: File) => void
  onColorChange?: (colors: { primary: string; secondary: string; accent: string }) => void
  onSave?: () => void
}

export interface LabelDesignPickerProps extends BaseComponentProps {
  designs: { id: string; name: string; thumbnail: string; premium?: boolean }[]
  selectedDesignId?: string
  onSelect?: (designId: string) => void
  onCustomUpload?: (file: File) => void
  allowCustomUpload?: boolean
}
