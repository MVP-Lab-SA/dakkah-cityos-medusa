import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

export type InvoiceItem = {
  id: string
  invoice_id: string
  title: string
  description?: string
  order_id?: string
  order_display_id?: string
  quantity: number
  unit_price: number
  subtotal: number
  tax_total: number
  total: number
}

export type Invoice = {
  id: string
  invoice_number: string
  company_id: string
  customer_id?: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled" | "void"
  issue_date: string
  due_date: string
  paid_at?: string
  subtotal: number
  tax_total: number
  discount_total: number
  total: number
  amount_paid: number
  amount_due: number
  currency_code: string
  period_start?: string
  period_end?: string
  payment_terms?: string
  payment_terms_days: number
  notes?: string
  internal_notes?: string
  pdf_url?: string
  items: InvoiceItem[]
  company?: {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  customer?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    phone?: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useInvoices(params?: {
  status?: string
  company_id?: string
  customer_id?: string
  date_from?: string
  date_to?: string
}) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.company_id) searchParams.set("company_id", params.company_id)
      if (params?.customer_id) searchParams.set("customer_id", params.customer_id)
      if (params?.date_from) searchParams.set("date_from", params.date_from)
      if (params?.date_to) searchParams.set("date_to", params.date_to)
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/invoices${query ? `?${query}` : ""}`)
      return response as { invoices: Invoice[] }
    },
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/invoices/${id}`)
      return response as { invoice: Invoice }
    },
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      company_id: string
      customer_id?: string
      issue_date: string
      due_date: string
      period_start?: string
      period_end?: string
      payment_terms?: string
      payment_terms_days?: number
      currency_code?: string
      notes?: string
      items: Array<{
        title: string
        description?: string
        order_id?: string
        quantity: number
        unit_price: number
      }>
    }) => {
      const response = await sdk.client.fetch(`/admin/invoices`, {
        method: "POST",
        body: data,
      })
      return response as { invoice: Invoice }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...data }: {
      id: string
      due_date?: string
      payment_terms?: string
      payment_terms_days?: number
      notes?: string
      internal_notes?: string
    }) => {
      const response = await sdk.client.fetch(`/admin/invoices/${id}`, {
        method: "PUT",
        body: data,
      })
      return response as { invoice: Invoice }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      queryClient.invalidateQueries({ queryKey: ["invoices", variables.id] })
    },
  })
}

export function useSendInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/invoices/${id}/send`, {
        method: "POST",
      })
      return response as { invoice: Invoice }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}

export function useRecordPayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount?: number }) => {
      const response = await sdk.client.fetch(`/admin/invoices/${id}/pay`, {
        method: "POST",
        body: { amount },
      })
      return response as { invoice: Invoice }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}

export function useVoidInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await sdk.client.fetch(`/admin/invoices/${id}/void`, {
        method: "POST",
        body: { reason },
      })
      return response as { invoice: Invoice }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/invoices/${id}`, {
        method: "DELETE",
      })
      return response as { success: boolean }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })
}
