import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface PurchaseOrderLineItem {
  id: string
  product_id: string
  product_title: string
  variant_id?: string
  variant_title?: string
  quantity: number
  unit_price: number
  total: number
}

export interface PurchaseOrder {
  id: string
  po_number: string
  status: "draft" | "pending_approval" | "approved" | "rejected" | "submitted" | "fulfilled" | "cancelled"
  company_id: string
  created_by: string
  created_by_name?: string
  approved_by?: string
  approved_by_name?: string
  created_at: string
  updated_at: string
  submitted_at?: string
  approved_at?: string
  items: PurchaseOrderLineItem[]
  subtotal: number
  tax_total: number
  shipping_total: number
  total: number
  currency_code: string
  notes?: string
  shipping_address?: {
    address_1: string
    city: string
    province?: string
    postal_code: string
    country_code: string
  }
}

// API Fetch helper
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(error.message || "Request failed")
  }
  
  return response.json()
}

export function usePurchaseOrders(companyId?: string) {
  return useQuery({
    queryKey: ["purchase-orders", companyId],
    queryFn: async () => {
      const params = companyId ? `?company_id=${companyId}` : ""
      const response = await fetchApi<{ purchase_orders: PurchaseOrder[] }>(
        `/store/purchase-orders${params}`
      )
      return response.purchase_orders || []
    },
  })
}

export function usePurchaseOrder(poId: string) {
  return useQuery({
    queryKey: ["purchase-order", poId],
    queryFn: async () => {
      const response = await fetchApi<{ purchase_order: PurchaseOrder }>(
        `/store/purchase-orders/${poId}`
      )
      return response.purchase_order
    },
    enabled: !!poId,
  })
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<PurchaseOrder>) => {
      const response = await fetchApi<{ purchase_order: PurchaseOrder }>(
        "/store/purchase-orders",
        {
          method: "POST",
          body: JSON.stringify({
            company_id: data.company_id,
            po_number: data.po_number,
            items: data.items,
            notes: data.notes,
            shipping_address_id: data.shipping_address,
          }),
        }
      )
      return response.purchase_order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
    },
  })
}

export function useSubmitPurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (poId: string) => {
      const response = await fetchApi<{ purchase_order: PurchaseOrder }>(
        `/store/purchase-orders/${poId}/submit`,
        { method: "POST" }
      )
      return response.purchase_order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] })
    },
  })
}

export function useCancelPurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (poId: string) => {
      await fetchApi(`/store/purchase-orders/${poId}`, { method: "DELETE" })
      return poId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] })
    },
  })
}

// Approval functions are typically admin-only, but keeping for compatibility
export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ poId, approverId }: { poId: string; approverId: string }) => {
      const response = await fetchApi<{ purchase_order: PurchaseOrder }>(
        `/admin/purchase-orders/${poId}/approve`,
        {
          method: "POST",
          body: JSON.stringify({ approver_id: approverId }),
        }
      )
      return response.purchase_order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] })
    },
  })
}

export function useRejectPurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ poId, reason }: { poId: string; reason?: string }) => {
      const response = await fetchApi<{ purchase_order: PurchaseOrder }>(
        `/admin/purchase-orders/${poId}/reject`,
        {
          method: "POST",
          body: JSON.stringify({ reason }),
        }
      )
      return response.purchase_order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] })
    },
  })
}
