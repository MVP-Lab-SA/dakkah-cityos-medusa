import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface DigitalProductCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  thumbnail?: MediaField
  price: PriceData
  fileType?: string
  fileSize?: string
  format?: string
  previewUrl?: string
  rating?: { average: number; count: number }
  variant?: "default" | "compact" | "detailed"
  onPurchase?: () => void
  onPreview?: () => void
}

export interface DownloadManagerProps extends BaseComponentProps {
  downloads: DownloadItem[]
  loading?: boolean
}

export interface DownloadItem {
  id: string
  title: string
  thumbnail?: string
  purchaseDate: string
  fileType: string
  fileSize: string
  downloadUrl: string
  downloadsRemaining?: number
  expiresAt?: string
  licenseKey?: string
}

export interface LicenseViewerProps extends BaseComponentProps {
  licenseId: string
  licenseKey: string
  productTitle: string
  status: "active" | "expired" | "revoked"
  activations: number
  maxActivations?: number
  issuedAt: string
  expiresAt?: string
}

export interface DigitalLibraryProps extends BaseComponentProps {
  items: DownloadItem[]
  onDownload: (itemId: string) => void
  onViewLicense?: (itemId: string) => void
  loading?: boolean
  filter?: "all" | "available" | "expired"
}

export interface FilePreviewProps extends BaseComponentProps {
  fileUrl: string
  fileType: "pdf" | "image" | "audio" | "video" | "document"
  title?: string
  onClose: () => void
}
