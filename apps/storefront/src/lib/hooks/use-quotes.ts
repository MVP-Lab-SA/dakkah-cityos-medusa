import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Quote, QuoteRequest, QuoteFilters } from "@/lib/types/quotes"

const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"
}

export function useQuotes(filters?: QuoteFilters) {
  const backendUrl = getBackendUrl()
  
  return useQuery({
    queryKey: ["quotes", filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.status) params.set("status", filters.status.join(","))
      if (filters?.created_after) params.set("created_after", filters.created_after)
      if (filters?.created_before) params.set("created_before", filters.created_before)
      
      const response = await fetch(
        `${backendUrl}/store/quotes?${params}`,
        { credentials: "include" }
      )
      
      if (!response.ok) throw new Error("Failed to fetch quotes")
      const data = await response.json()
      return data.quotes as Quote[]
    }
  })
}

export function useQuote(id: string | undefined) {
  const backendUrl = getBackendUrl()
  
  return useQuery({
    queryKey: ["quote", id],
    queryFn: async () => {
      const response = await fetch(
        `${backendUrl}/store/quotes/${id}`,
        { credentials: "include" }
      )
      
      if (!response.ok) throw new Error("Failed to fetch quote")
      const data = await response.json()
      return data.quote as Quote
    },
    enabled: !!id
  })
}

export function useRequestQuote() {
  const queryClient = useQueryClient()
  const backendUrl = getBackendUrl()
  
  return useMutation({
    mutationFn: async (data: QuoteRequest) => {
      const response = await fetch(`${backendUrl}/store/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error("Failed to request quote")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
    }
  })
}

export function useAcceptQuote() {
  const queryClient = useQueryClient()
  const backendUrl = getBackendUrl()
  
  return useMutation({
    mutationFn: async (quoteId: string) => {
      const response = await fetch(
        `${backendUrl}/store/quotes/${quoteId}/accept`,
        {
          method: "POST",
          credentials: "include"
        }
      )
      
      if (!response.ok) throw new Error("Failed to accept quote")
      return response.json()
    },
    onSuccess: (_, quoteId) => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["quote", quoteId] })
    }
  })
}

export function useDeclineQuote() {
  const queryClient = useQueryClient()
  const backendUrl = getBackendUrl()
  
  return useMutation({
    mutationFn: async ({ quoteId, reason }: { quoteId: string; reason?: string }) => {
      const response = await fetch(
        `${backendUrl}/store/quotes/${quoteId}/decline`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason })
        }
      )
      
      if (!response.ok) throw new Error("Failed to decline quote")
      return response.json()
    },
    onSuccess: (_, { quoteId }) => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] })
      queryClient.invalidateQueries({ queryKey: ["quote", quoteId] })
    }
  })
}
