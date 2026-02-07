import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

export type Company = {
  id: string
  name: string
  email: string
  phone?: string
  tax_id?: string
  tier: "bronze" | "silver" | "gold" | "platinum"
  status: "pending" | "active" | "suspended"
  credit_limit: number
  credit_balance: number
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

export type CompanyUser = {
  id: string
  company_id: string
  customer_id: string
  role: "admin" | "buyer" | "viewer"
  spending_limit?: number
  is_active: boolean
  customer?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
  }
  created_at: string
}

export type PurchaseOrder = {
  id: string
  company_id: string
  po_number: string
  status: "draft" | "pending_approval" | "approved" | "rejected" | "fulfilled" | "closed"
  total: number
  currency_code: string
  items: PurchaseOrderItem[]
  company?: Company
  submitted_by?: string
  approved_by?: string
  approved_at?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type PurchaseOrderItem = {
  id: string
  purchase_order_id: string
  product_id?: string
  variant_id?: string
  title: string
  sku?: string
  quantity: number
  unit_price: number
  total: number
}

// Companies hooks
export function useCompanies(params?: { status?: string; tier?: string; search?: string }) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.tier) searchParams.set("tier", params.tier)
      if (params?.search) searchParams.set("q", params.search)
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/companies${query ? `?${query}` : ""}`)
      return response as { companies: Company[] }
    },
  })
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["companies", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/companies/${id}`)
      return response as { company: Company }
    },
    enabled: !!id,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<Company>) => {
      const response = await sdk.client.fetch(`/admin/companies`, {
        method: "POST",
        body: data,
      })
      return response as { company: Company }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Company> & { id: string }) => {
      const response = await sdk.client.fetch(`/admin/companies/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { company: Company }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
      queryClient.invalidateQueries({ queryKey: ["companies", variables.id] })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await sdk.client.fetch(`/admin/companies/${id}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })
}

// Company users hooks
export function useCompanyUsers(companyId: string) {
  return useQuery({
    queryKey: ["companies", companyId, "users"],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/companies/${companyId}/users`)
      return response as { users: CompanyUser[] }
    },
    enabled: !!companyId,
  })
}

// Purchase orders hooks
export function usePurchaseOrders(params?: { company_id?: string; status?: string }) {
  return useQuery({
    queryKey: ["purchase-orders", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.company_id) searchParams.set("company_id", params.company_id)
      if (params?.status) searchParams.set("status", params.status)
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/purchase-orders${query ? `?${query}` : ""}`)
      return response as { purchase_orders: PurchaseOrder[] }
    },
  })
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ["purchase-orders", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/purchase-orders/${id}`)
      return response as { purchase_order: PurchaseOrder }
    },
    enabled: !!id,
  })
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const response = await sdk.client.fetch(`/admin/purchase-orders/${id}/approve`, {
        method: "POST",
        body: { notes },
      })
      return response as { purchase_order: PurchaseOrder }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
    },
  })
}

export function useRejectPurchaseOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await sdk.client.fetch(`/admin/purchase-orders/${id}/reject`, {
        method: "POST",
        body: { reason },
      })
      return response as { purchase_order: PurchaseOrder }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
    },
  })
}
