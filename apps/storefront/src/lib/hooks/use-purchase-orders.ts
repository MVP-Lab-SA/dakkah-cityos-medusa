import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"

export interface PurchaseOrderItem {
  id: string
  purchase_order_id: string
  product_id?: string
  variant_id?: string
  title: string
  description?: string
  sku?: string
  barcode?: string
  thumbnail?: string
  quantity: number
  fulfilled_quantity: number
  unit_price?: number
  total?: number
  status: "pending" | "fulfilled" | "partial" | "cancelled"
  expected_ship_date?: string
  actual_ship_date?: string
  tracking_number?: string
  notes?: string
  metadata?: Record<string, unknown>
}

export interface PurchaseOrder {
  id: string
  po_number: string
  company_id: string
  customer_id: string
  tenant_id?: string
  order_id?: string
  cart_id?: string
  quote_id?: string
  external_po_number?: string
  department?: string
  cost_center?: string
  project_code?: string
  status:
    | "draft"
    | "pending_approval"
    | "approved"
    | "rejected"
    | "submitted"
    | "fulfilled"
    | "partially_fulfilled"
    | "cancelled"
  requires_approval: boolean
  approved_by_id?: string
  approved_by?: string
  approved_by_name?: string
  approved_at?: string
  approval_notes?: string
  rejected_by_id?: string
  rejected_at?: string
  rejection_reason?: string
  currency_code: string
  payment_terms_id?: string
  payment_due_date?: string
  payment_status: "pending" | "partial" | "paid" | "overdue" | "cancelled"
  issue_date?: string
  expected_delivery_date?: string
  actual_delivery_date?: string
  shipping_address?: Record<string, unknown>
  billing_address?: Record<string, unknown>
  shipping_method_id?: string
  internal_notes?: string
  vendor_notes?: string
  items: PurchaseOrderItem[]
  subtotal?: number
  tax_total?: number
  shipping_total?: number
  total?: number
  notes?: string
  created_by?: string
  created_by_name?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
  submitted_at?: string
}

export function usePurchaseOrders(companyId?: string) {
  return useQuery({
    queryKey: queryKeys.purchaseOrders.list(companyId),
    queryFn: async () => {
      const params = companyId ? `?company_id=${companyId}` : ""
      const response = await sdk.client.fetch<{
        purchase_orders: PurchaseOrder[]
      }>(`/store/purchase-orders${params}`, { credentials: "include" })
      return response.purchase_orders || []
    },
  })
}

export function usePurchaseOrder(poId: string) {
  return useQuery({
    queryKey: queryKeys.purchaseOrders.detail(poId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        purchase_order: PurchaseOrder
      }>(`/store/purchase-orders/${poId}`, { credentials: "include" })
      return response.purchase_order
    },
    enabled: !!poId,
  })
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<PurchaseOrder>) => {
      const response = await sdk.client.fetch<{
        purchase_order: PurchaseOrder
      }>("/store/purchase-orders", {
        method: "POST",
        credentials: "include",
        body: {
          company_id: data.company_id,
          po_number: data.po_number,
          items: data.items,
          notes: data.notes,
          shipping_address: data.shipping_address,
        },
      })
      return response.purchase_order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders.all })
    },
  })
}

export function useSubmitPurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (poId: string) => {
      const response = await sdk.client.fetch<{
        purchase_order: PurchaseOrder
      }>(`/store/purchase-orders/${poId}/submit`, {
        method: "POST",
        credentials: "include",
      })
      return response.purchase_order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders.all })
    },
  })
}

export function useCancelPurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (poId: string) => {
      await sdk.client.fetch(`/store/purchase-orders/${poId}`, {
        method: "DELETE",
        credentials: "include",
      })
      return poId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders.all })
    },
  })
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      poId,
      approverId,
    }: {
      poId: string
      approverId: string
    }) => {
      const response = await sdk.client.fetch<{
        purchase_order: PurchaseOrder
      }>(`/admin/purchase-orders/${poId}/approve`, {
        method: "POST",
        credentials: "include",
        body: { approver_id: approverId },
      })
      return response.purchase_order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders.all })
    },
  })
}

export function useRejectPurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ poId, reason }: { poId: string; reason?: string }) => {
      const response = await sdk.client.fetch<{
        purchase_order: PurchaseOrder
      }>(`/admin/purchase-orders/${poId}/reject`, {
        method: "POST",
        credentials: "include",
        body: { reason },
      })
      return response.purchase_order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders.all })
    },
  })
}
