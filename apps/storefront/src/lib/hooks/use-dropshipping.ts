import { useQuery } from "@tanstack/react-query"

export interface Supplier {
  id: string
  name: string
  logo?: string
  description?: string
  rating?: { average: number; count: number }
  productCount?: number
  shippingRegions?: string[]
  leadTime?: string
  verified?: boolean
}

export interface SupplierProduct {
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
}

export interface DropshipOrder {
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

export function useSuppliers(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["suppliers", filters],
    queryFn: async () => {
      return [] as Supplier[]
    },
    placeholderData: [],
  })
}

export function useSupplierProducts(
  supplierId: string,
  filters?: Record<string, unknown>,
) {
  return useQuery({
    queryKey: ["supplier-products", supplierId, filters],
    queryFn: async () => {
      return [] as SupplierProduct[]
    },
    enabled: !!supplierId,
    placeholderData: [],
  })
}

export function useDropshipOrders(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["dropship-orders", filters],
    queryFn: async () => {
      return [] as DropshipOrder[]
    },
    placeholderData: [],
  })
}
