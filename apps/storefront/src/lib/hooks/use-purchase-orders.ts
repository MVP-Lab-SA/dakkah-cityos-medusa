import { useState } from "react"
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

// Mock data
const mockPurchaseOrders: PurchaseOrder[] = []

export function usePurchaseOrders(companyId?: string) {
  return useQuery({
    queryKey: ["purchase-orders", companyId],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockPurchaseOrders.filter(
        (po) => !companyId || po.company_id === companyId
      )
    },
    enabled: !!companyId,
  })
}

export function usePurchaseOrder(poId: string) {
  return useQuery({
    queryKey: ["purchase-order", poId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockPurchaseOrders.find((po) => po.id === poId) || null
    },
    enabled: !!poId,
  })
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<PurchaseOrder>) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newPO: PurchaseOrder = {
        id: `po_${Date.now()}`,
        po_number: `PO-${Date.now().toString().slice(-6)}`,
        status: "draft",
        company_id: data.company_id || "",
        created_by: data.created_by || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: data.items || [],
        subtotal: data.subtotal || 0,
        tax_total: data.tax_total || 0,
        shipping_total: data.shipping_total || 0,
        total: data.total || 0,
        currency_code: data.currency_code || "usd",
        notes: data.notes,
      }
      mockPurchaseOrders.push(newPO)
      return newPO
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
      await new Promise((resolve) => setTimeout(resolve, 500))
      const po = mockPurchaseOrders.find((p) => p.id === poId)
      if (po) {
        po.status = "pending_approval"
        po.submitted_at = new Date().toISOString()
        po.updated_at = new Date().toISOString()
      }
      return po
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] })
    },
  })
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ poId, approverId }: { poId: string; approverId: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const po = mockPurchaseOrders.find((p) => p.id === poId)
      if (po) {
        po.status = "approved"
        po.approved_by = approverId
        po.approved_at = new Date().toISOString()
        po.updated_at = new Date().toISOString()
      }
      return po
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
      await new Promise((resolve) => setTimeout(resolve, 500))
      const po = mockPurchaseOrders.find((p) => p.id === poId)
      if (po) {
        po.status = "rejected"
        po.updated_at = new Date().toISOString()
      }
      return po
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] })
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] })
    },
  })
}
