import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../utils/sdk"

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await sdk.client.fetch<T>(path, {
    method: options?.method || "GET",
    body: options?.body,
  })
  return response as T
}

export const giftCardKeys = {
  all: ["gift-cards"] as const,
  list: () => [...giftCardKeys.all, "list"] as const,
  detail: (id: string) => [...giftCardKeys.all, "detail", id] as const,
  balance: (code: string) => [...giftCardKeys.all, "balance", code] as const,
  designs: () => [...giftCardKeys.all, "designs"] as const,
}

export interface GiftCardDesign {
  id: string
  name: string
  category: "birthday" | "holiday" | "thank-you" | "celebration" | "general"
  imageUrl?: string
  colors: { primary: string; secondary: string }
}

export interface GiftCardInfo {
  id: string
  code: string
  balance: number
  originalAmount: number
  currency: string
  expiresAt?: string
  status: "active" | "redeemed" | "expired" | "disabled"
  recipientEmail?: string
  senderName?: string
  message?: string
  designId?: string
  transactions?: {
    id: string
    type: "purchase" | "redemption" | "refund"
    amount: number
    date: string
    description: string
  }[]
}

export interface PurchaseGiftCardData {
  amount: number
  recipientEmail: string
  recipientName?: string
  senderName?: string
  message?: string
  deliveryDate?: string
  designId?: string
}

export function useGiftCardDesigns() {
  return useQuery({
    queryKey: giftCardKeys.designs(),
    queryFn: async () => {
      try {
        const response = await fetchApi<{ designs: GiftCardDesign[] }>(
          "/store/gift-cards/designs",
        )
        return response.designs
      } catch {
        return [
          {
            id: "birthday-1",
            name: "Birthday",
            category: "birthday",
            colors: { primary: "#FF6B6B", secondary: "#FFE66D" },
          },
          {
            id: "holiday-1",
            name: "Holiday",
            category: "holiday",
            colors: { primary: "#2ECC71", secondary: "#E74C3C" },
          },
          {
            id: "thanks-1",
            name: "Thank You",
            category: "thank-you",
            colors: { primary: "#3498DB", secondary: "#9B59B6" },
          },
          {
            id: "celebrate-1",
            name: "Celebration",
            category: "celebration",
            colors: { primary: "#F39C12", secondary: "#E67E22" },
          },
          {
            id: "general-1",
            name: "Classic",
            category: "general",
            colors: { primary: "#34495E", secondary: "#2C3E50" },
          },
          {
            id: "general-2",
            name: "Minimal",
            category: "general",
            colors: { primary: "#1ABC9C", secondary: "#16A085" },
          },
        ] as GiftCardDesign[]
      }
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useGiftCardList() {
  return useQuery({
    queryKey: giftCardKeys.list(),
    queryFn: async () => {
      try {
        const response = await fetchApi<{ giftCards: GiftCardInfo[] }>(
          "/store/gift-cards",
        )
        return response.giftCards
      } catch {
        return [] as GiftCardInfo[]
      }
    },
    staleTime: 60 * 1000,
  })
}

export function useGiftCardBalance(code: string) {
  return useQuery({
    queryKey: giftCardKeys.balance(code),
    queryFn: async () => {
      const response = await fetchApi<{ giftCard: GiftCardInfo }>(
        `/store/gift-cards/${code}/balance`,
      )
      return response.giftCard
    },
    enabled: !!code,
    staleTime: 30 * 1000,
  })
}

export function usePurchaseGiftCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PurchaseGiftCardData) => {
      return fetchApi<{ giftCard: GiftCardInfo }>("/store/gift-cards", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giftCardKeys.list() })
    },
  })
}

export function useRedeemGiftCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (code: string) => {
      return fetchApi<{ giftCard: GiftCardInfo }>("/store/gift-cards/redeem", {
        method: "POST",
        body: JSON.stringify({ code }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giftCardKeys.all })
    },
  })
}
