import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface AuctionCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  currentPrice: PriceData
  startingPrice: PriceData
  reservePrice?: PriceData
  buyNowPrice?: PriceData
  auctionType: "english" | "dutch" | "sealed" | "reserve"
  status: "scheduled" | "active" | "ended" | "cancelled"
  startsAt: string
  endsAt: string
  totalBids: number
  isWatching?: boolean
  variant?: "default" | "compact" | "featured"
  onBid?: () => void
  onWatch?: () => void
}

export interface BidPanelProps extends BaseComponentProps {
  auctionId: string
  currentPrice: PriceData
  bidIncrement: PriceData
  minBid: PriceData
  buyNowPrice?: PriceData
  isAutoBidEnabled?: boolean
  userMaxBid?: PriceData
  onPlaceBid: (amount: number) => void
  onSetAutoBid?: (maxAmount: number) => void
  onBuyNow?: () => void
  disabled?: boolean
}

export interface AuctionCountdownProps extends BaseComponentProps {
  endsAt: string
  startsAt?: string
  status: "scheduled" | "active" | "ended"
  size?: Size
  variant?: "inline" | "card" | "banner"
  onExpire?: () => void
}

export interface BidHistoryProps extends BaseComponentProps {
  auctionId: string
  bids: BidEntry[]
  showAll?: boolean
  limit?: number
}

export interface BidEntry {
  id: string
  amount: PriceData
  bidderId: string
  bidderName?: string
  timestamp: string
  isAutoBid?: boolean
  isWinning?: boolean
}

export interface AuctionFilterProps extends BaseComponentProps {
  auctionTypes?: ("english" | "dutch" | "sealed" | "reserve")[]
  statuses?: ("scheduled" | "active" | "ended")[]
  priceRange?: { min: number; max: number }
  onFilterChange: (filters: Record<string, unknown>) => void
}

export interface AuctionResultProps extends BaseComponentProps {
  auctionId: string
  winner?: { id: string; name: string }
  finalPrice: PriceData
  totalBids: number
  status: "won" | "lost" | "reserve-not-met" | "cancelled"
}
