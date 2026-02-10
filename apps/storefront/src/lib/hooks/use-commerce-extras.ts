import { useQuery } from "@tanstack/react-query"

const baseUrl = typeof window !== "undefined"
  ? (import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000")
  : "http://localhost:9000"

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
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

export const commerceExtrasKeys = {
  all: ["commerce-extras"] as const,
  tradeIn: (productId: string) => [...commerceExtrasKeys.all, "trade-in", productId] as const,
  consignments: () => [...commerceExtrasKeys.all, "consignments"] as const,
  loyalty: () => [...commerceExtrasKeys.all, "loyalty"] as const,
  referral: () => [...commerceExtrasKeys.all, "referral"] as const,
}

export interface TradeInEstimate {
  id: string
  productId: string
  title: string
  thumbnail?: string
  estimatedValue: number
  currencyCode: string
  condition: "excellent" | "good" | "fair" | "poor"
  status: "pending" | "evaluated" | "accepted" | "rejected"
}

export interface ConsignmentListing {
  id: string
  title: string
  thumbnail?: string
  askingPrice: number
  currencyCode: string
  commissionRate: number
  status: "pending" | "listed" | "sold" | "returned"
  listedAt?: string
}

export interface LoyaltyPoints {
  balance: number
  lifetimeEarned: number
  currentTier: string
  nextTier?: string
  tierProgress: number
  pointsToNextTier: number
  expiringPoints: number
  expiringDate?: string
  recentActivity: {
    id: string
    type: "earned" | "redeemed" | "expired"
    points: number
    description: string
    date: string
  }[]
  rewards: {
    id: string
    title: string
    description: string
    pointsCost: number
    thumbnail?: string
    available: boolean
  }[]
}

export interface ReferralInfo {
  code: string
  link: string
  totalReferred: number
  totalEarned: number
  currencyCode: string
  rewardDescription: string
  history: {
    id: string
    referredEmail: string
    status: "pending" | "completed" | "expired"
    reward: number
    date: string
  }[]
}

export function useTradeInEstimate(productId: string) {
  return useQuery({
    queryKey: commerceExtrasKeys.tradeIn(productId),
    queryFn: async () => {
      const response = await fetchApi<{ trade_in: TradeInEstimate }>(
        `/store/trade-in/estimate/${productId}`
      )
      return response.trade_in
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useConsignmentListings() {
  return useQuery({
    queryKey: commerceExtrasKeys.consignments(),
    queryFn: async () => {
      const response = await fetchApi<{ consignments: ConsignmentListing[] }>(
        "/store/consignments"
      )
      return response.consignments
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useLoyaltyPoints() {
  return useQuery({
    queryKey: commerceExtrasKeys.loyalty(),
    queryFn: async () => {
      const response = await fetchApi<{ loyalty: LoyaltyPoints }>(
        "/store/loyalty"
      )
      return response.loyalty
    },
    staleTime: 60 * 1000,
  })
}

export function useReferralInfo() {
  return useQuery({
    queryKey: commerceExtrasKeys.referral(),
    queryFn: async () => {
      const response = await fetchApi<{ referral: ReferralInfo }>(
        "/store/referrals/me"
      )
      return response.referral
    },
    staleTime: 5 * 60 * 1000,
  })
}
