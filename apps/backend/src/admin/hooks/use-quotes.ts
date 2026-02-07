import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

export type Quote = {
  id: string
  customer_id: string
  company_id?: string
  status: "draft" | "pending" | "sent" | "accepted" | "rejected" | "expired" | "converted"
  quote_number: string
  subtotal: number
  discount_total: number
  tax_total: number
  total: number
  currency_code: string
  valid_until?: string
  notes?: string
  internal_notes?: string
  customer?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
  }
  company?: {
    id: string
    name: string
  }
  items: QuoteItem[]
  versions?: QuoteVersion[]
  converted_order_id?: string
  created_at: string
  updated_at: string
}

export type QuoteItem = {
  id: string
  quote_id: string
  product_id?: string
  variant_id?: string
  title: string
  description?: string
  sku?: string
  quantity: number
  unit_price: number
  original_price?: number
  discount_amount: number
  total: number
  metadata?: Record<string, unknown>
}

export type QuoteVersion = {
  id: string
  quote_id: string
  version_number: number
  items: QuoteItem[]
  subtotal: number
  total: number
  created_by?: string
  created_at: string
}

// Quotes hooks
export function useQuotes(params?: { 
  status?: string; 
  customer_id?: string; 
  company_id?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["quotes", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.customer_id) searchParams.set("customer_id", params.customer_id)
      if (params?.company_id) searchParams.set("company_id", params.company_id)
      if (params?.search) searchParams.set("q", params.search)
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/quotes${query ? `?${query}` : ""}`)
      return response as { quotes: Quote[] }
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

export function useCreateQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { 
      customer_id: string; 
      company_id?: string;
      items: Partial<QuoteItem>[];
      notes?: string;
      valid_until?: string;
    }) => {
      const response = await sdk.client.fetch(`/admin/quotes`, {
        method: "POST",
        body: data,
      })
      return response as { quote: Quote }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}

export function useUpdateQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Quote> & { id: string }) => {
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

export function useUpdateQuoteItems() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, items }: { id: string; items: Partial<QuoteItem>[] }) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}/items`, {
        method: "PUT",
        body: { items },
      })
      return response as { quote: Quote }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotes", variables.id] })
    },
  })
}

export function useSendQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, message }: { id: string; message?: string }) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}/send`, {
        method: "POST",
        body: { message },
      })
      return response as { quote: Quote }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}

export function useApproveQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}/approve`, {
        method: "POST",
      })
      return response as { quote: Quote }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}

export function useRejectQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}/reject`, {
        method: "POST",
        body: { reason },
      })
      return response as { quote: Quote }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}

export function useConvertQuoteToOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}/convert`, {
        method: "POST",
      })
      return response as { quote: Quote; order_id: string }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}

export function useDuplicateQuote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/quotes/${id}/duplicate`, {
        method: "POST",
      })
      return response as { quote: Quote }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    },
  })
}
