import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

export type Vendor = {
  id: string
  name: string
  email: string
  phone?: string
  description?: string
  logo?: string
  status: "pending" | "active" | "suspended" | "rejected"
  tier: "bronze" | "silver" | "gold" | "platinum"
  commission_rate: number
  bank_account?: {
    account_holder: string
    account_number: string
    routing_number: string
    bank_name: string
  }
  stripe_account_id?: string
  address?: {
    address_1?: string
    address_2?: string
    city?: string
    province?: string
    postal_code?: string
    country_code?: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type VendorProduct = {
  id: string
  vendor_id: string
  product_id: string
  commission_override?: number
  product?: {
    id: string
    title: string
    thumbnail?: string
    status: string
  }
  created_at: string
}

export type VendorOrder = {
  id: string
  vendor_id: string
  order_id: string
  subtotal: number
  commission_amount: number
  payout_status: "pending" | "processing" | "paid"
  order?: {
    id: string
    display_id: number
    status: string
    created_at: string
  }
  created_at: string
}

export type Payout = {
  id: string
  vendor_id: string
  amount: number
  currency_code: string
  status: "pending" | "processing" | "completed" | "failed"
  payout_method: "stripe" | "bank_transfer" | "manual"
  stripe_transfer_id?: string
  notes?: string
  vendor?: Vendor
  processed_at?: string
  created_at: string
}

export type VendorAnalytics = {
  total_sales: number
  total_orders: number
  average_order_value: number
  commission_earned: number
  pending_payout: number
  return_rate: number
  rating: number
  top_products: {
    product_id: string
    title: string
    sales: number
    quantity: number
  }[]
}

// Vendors hooks
export function useVendors(params?: { status?: string; tier?: string; search?: string }) {
  return useQuery({
    queryKey: ["vendors", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.tier) searchParams.set("tier", params.tier)
      if (params?.search) searchParams.set("q", params.search)
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/vendors${query ? `?${query}` : ""}`)
      return response as { vendors: Vendor[] }
    },
  })
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: ["vendors", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/vendors/${id}`)
      return response as { vendor: Vendor }
    },
    enabled: !!id,
  })
}

export function useCreateVendor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<Vendor>) => {
      const response = await sdk.client.fetch(`/admin/vendors`, {
        method: "POST",
        body: data,
      })
      return response as { vendor: Vendor }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })
}

export function useUpdateVendor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Vendor> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/vendors/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { vendor: Vendor }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
      queryClient.invalidateQueries({ queryKey: ["vendors", variables.id] })
    },
  })
}

export function useApproveVendor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/vendors/${id}/approve`, {
        method: "POST",
      })
      return response as { vendor: Vendor }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })
}

export function useRejectVendor() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await sdk.client.fetch(`/admin/vendors/${id}/reject`, {
        method: "POST",
        body: { reason },
      })
      return response as { vendor: Vendor }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })
}

// Vendor products hooks
export function useVendorProducts(vendorId: string) {
  return useQuery({
    queryKey: ["vendors", vendorId, "products"],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/vendors/${vendorId}/products`)
      return response as { products: VendorProduct[] }
    },
    enabled: !!vendorId,
  })
}

// Vendor orders hooks
export function useVendorOrders(vendorId: string) {
  return useQuery({
    queryKey: ["vendors", vendorId, "orders"],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/vendors/${vendorId}/orders`)
      return response as { orders: VendorOrder[] }
    },
    enabled: !!vendorId,
  })
}

// Vendor analytics hooks
export function useVendorAnalytics(vendorId: string) {
  return useQuery({
    queryKey: ["vendors", vendorId, "analytics"],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/vendors/${vendorId}/analytics`)
      return response as { analytics: VendorAnalytics }
    },
    enabled: !!vendorId,
  })
}

// Payouts hooks
export function usePayouts(params?: { vendor_id?: string; status?: string }) {
  return useQuery({
    queryKey: ["payouts", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.vendor_id) searchParams.set("vendor_id", params.vendor_id)
      if (params?.status) searchParams.set("status", params.status)
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/payouts${query ? `?${query}` : ""}`)
      return response as { payouts: Payout[] }
    },
  })
}

export function useProcessPayout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, method }: { id: string; method: "stripe" | "bank_transfer" | "manual" }) => {
      const response = await sdk.client.fetch(`/admin/payouts/${id}/process`, {
        method: "POST",
        body: { method },
      })
      return response as { payout: Payout }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payouts"] })
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
    },
  })
}
