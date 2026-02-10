import { useQuery } from "@tanstack/react-query"

export interface AuctionItem {
  id: string
  title: string
  description?: string
  thumbnail?: string
  currentPrice: { amount: number; currencyCode: string }
  startingPrice: { amount: number; currencyCode: string }
  buyNowPrice?: { amount: number; currencyCode: string }
  auctionType: "english" | "dutch" | "sealed" | "reserve"
  status: "scheduled" | "active" | "ended" | "cancelled"
  startsAt: string
  endsAt: string
  totalBids: number
  isWatching?: boolean
  seller?: { id: string; name: string }
  images?: string[]
}

export interface BidEntry {
  id: string
  amount: { amount: number; currencyCode: string }
  bidderId: string
  bidderName?: string
  timestamp: string
  isAutoBid?: boolean
  isWinning?: boolean
}

export function useAuctions(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["auctions", filters],
    queryFn: async () => {
      return [] as AuctionItem[]
    },
    placeholderData: [],
  })
}

export function useAuction(auctionId: string) {
  return useQuery({
    queryKey: ["auction", auctionId],
    queryFn: async () => {
      return null as AuctionItem | null
    },
    enabled: !!auctionId,
  })
}

export function useAuctionBids(auctionId: string) {
  return useQuery({
    queryKey: ["auction-bids", auctionId],
    queryFn: async () => {
      return [] as BidEntry[]
    },
    enabled: !!auctionId,
    placeholderData: [],
  })
}
