import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/client"

export type Review = {
  id: string
  rating: number
  title?: string
  content: string
  customer_id: string
  customer_name?: string
  customer_email?: string
  product_id?: string
  vendor_id?: string
  order_id?: string
  is_verified_purchase: boolean
  is_approved: boolean
  helpful_count: number
  images: string[]
  product?: {
    id: string
    title: string
    thumbnail?: string
  }
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function useReviews(params?: {
  is_approved?: boolean
  product_id?: string
  vendor_id?: string
  rating?: number
}) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (params?.is_approved !== undefined) searchParams.set("is_approved", String(params.is_approved))
      if (params?.product_id) searchParams.set("product_id", params.product_id)
      if (params?.vendor_id) searchParams.set("vendor_id", params.vendor_id)
      if (params?.rating !== undefined) searchParams.set("rating", String(params.rating))
      
      const query = searchParams.toString()
      const response = await sdk.client.fetch(`/admin/reviews${query ? `?${query}` : ""}`)
      return response as { reviews: Review[] }
    },
  })
}

export function useReview(id: string) {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const response = await sdk.client.fetch(`/admin/reviews/${id}`)
      return response as { review: Review }
    },
    enabled: !!id,
  })
}

export function useApproveReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/reviews/${id}/approve`, {
        method: "POST",
      })
      return response as { review: Review }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}

export function useRejectReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/reviews/${id}/reject`, {
        method: "POST",
      })
      return response as { review: Review }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}

export function useVerifyReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/reviews/${id}/verify`, {
        method: "POST",
      })
      return response as { review: Review }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.client.fetch(`/admin/reviews/${id}`, {
        method: "DELETE",
      })
      return response as { success: boolean }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
    },
  })
}
