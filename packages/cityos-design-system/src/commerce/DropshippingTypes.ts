import type { BaseComponentProps } from "../components/ComponentTypes"

export interface SupplierCardProps extends BaseComponentProps {
  id: string
  name: string
  logo?: string
  description?: string
  rating?: { average: number; count: number }
  productCount?: number
  shippingRegions?: string[]
  leadTime?: string
  verified?: boolean
  onViewCatalog?: () => void
}

export interface DropshipOrderCardProps extends BaseComponentProps {
  id: string
  orderNumber: string
  supplierName: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: { id: string; title: string; quantity: number; thumbnail?: string }[]
  total: { amount: number; currencyCode: string }
  trackingNumber?: string
  createdAt: string
  estimatedDelivery?: string
}

export interface SupplierProductCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  wholesalePrice: { amount: number; currencyCode: string }
  retailPrice: { amount: number; currencyCode: string }
  margin?: number
  moq?: number
  supplierName: string
  inStock?: boolean
  shippingTime?: string
  onAddToStore?: () => void
}
