import { useQuery, useMutation } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type {
  Invoice,
  InvoiceFilters,
  EarlyPaymentDiscount,
} from "@/lib/types/invoices"

export function useInvoices(filters?: InvoiceFilters) {
  return useQuery({
    queryKey: queryKeys.invoices.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.status) params.set("status", filters.status.join(","))
      if (filters?.order_id) params.set("order_id", filters.order_id)
      if (filters?.created_after)
        params.set("created_after", filters.created_after)
      if (filters?.created_before)
        params.set("created_before", filters.created_before)

      const response = await sdk.client.fetch<{
        invoices: Invoice[]
        count: number
      }>(`/store/invoices?${params}`, { credentials: "include" })
      return response
    },
  })
}

export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(invoiceId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ invoice: Invoice }>(
        `/store/invoices/${invoiceId}`,
        { credentials: "include" },
      )
      return response.invoice
    },
    enabled: !!invoiceId,
  })
}

export function useInvoiceDownload() {
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await sdk.client.fetch<{ pdf_url: string }>(
        `/store/invoices/${invoiceId}/download`,
        { credentials: "include" },
      )
      if (response.pdf_url) {
        window.open(response.pdf_url, "_blank")
      }
      return response
    },
  })
}

export function useEarlyPaymentDiscount(invoiceId: string) {
  return useQuery({
    queryKey: [...queryKeys.invoices.detail(invoiceId), "early-payment"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        discount: EarlyPaymentDiscount
      }>(`/store/invoices/${invoiceId}/early-payment`, {
        credentials: "include",
      })
      return response.discount
    },
    enabled: !!invoiceId,
  })
}

export function useApplyEarlyPayment() {
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      return sdk.client.fetch(`/store/invoices/${invoiceId}/early-payment`, {
        method: "POST",
        credentials: "include",
      })
    },
  })
}
