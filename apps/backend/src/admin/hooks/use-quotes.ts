import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client.js"

export type QuoteItem = {
  id: string
  quote_id: string
  product_id: string
  variant_id?: string
  title: string
  description?: string
  quantity: number
  unit_price: number
  total: number
}

export type Quote = {
  id: string
  quote_number: string
  company_id: string
  customer_id: string
  cart_id?: string
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "accepted" | "declined" | "expired"
  subtotal: number
  discount_total: number
  tax_total: number
  shipping_total: number
  total: number
  currency_code: string
  custom_discount_percentage?: number
  custom_discount_amount?: number
  discount_reason?: string
  valid_from?: string
  valid_until?: string
  reviewed_by?: string
  reviewed_at?: string
  rejection_reason?: string
  accepted_at?: string
  declined_at?: string
  declined_reason?: string
  customer_notes?: string
  internal_notes?: string
  items?: QuoteItem[]
  items_count?: number
  company?: {
    id: string
    name: string
    email: string
    phone?: string
  }
  customer?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    phone?: string
  }
  customer_email?: string
  total_amount?: number
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useQuotes(params?: {
  status?: string
  company_id?: string
  customer_id?: string
}) {
  return useQuery({
    queryKey: ["quotes", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.company_id) searchParams.set("company_id", params.company_id)
      if (params?.customer_id) searchParams.set("customer_id", params.customer_id)
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/quotes${query ? `?${query}` : ""}`)
      return response as { quotes: Quote[]; count: number }
    },
  })
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quotes", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}`)
      return response as { quote: Quote }
    },
    enabled: !!id,
  })
}

export function useUpdateQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string
      custom_discount_percentage?: number
      custom_discount_amount?: number
      discount_reason?: string
      valid_until?: string
      internal_notes?: string
    }) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { quote: Quote }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["quotes", variables.id] })
    },
  })
}

export function useApproveQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string
      quoted_price?: number
      custom_discount_percentage?: number
      custom_discount_amount?: number
      discount_reason?: string
      valid_until?: string
      internal_notes?: string
    }) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}/approve`, {
        method: "POST",
        body: data,
      })
      return response as { quote: Quote }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] })
    },
  })
}

export function useRejectQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, rejection_reason, internal_notes }: {
      id: string
      rejection_reason?: string
      internal_notes?: string
    }) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}/reject`, {
        method: "POST",
        body: { rejection_reason, internal_notes },
      })
      return response as { quote: Quote }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] })
    },
  })
}
