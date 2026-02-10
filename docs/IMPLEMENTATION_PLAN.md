# Dakkah CityOS Commerce Platform — Implementation Plan

## Closing the Gap: From 53-Model Reference to Full Platform Coverage

**Date:** February 10, 2026
**Based on:** [Gap Analysis](./GAP_ANALYSIS.md) vs. medusa-core-nrd4 reference (53 models, 100+ UI patterns)
**Scope:** 7 implementation phases, ~75+ new types, ~24 new routes, ~65 new UI patterns

---

## 1. Implementation Philosophy

### 1.1 Design-System-First Approach

Every new feature follows this strict order:

```
Types (design-system) → Contracts (shared) → Backend (if needed) → Components → Routes → i18n → Tests
```

No component is written until its type definition exists in `packages/cityos-design-system/src/`. No route is created until its components are built. This ensures consistency across all 53 commerce models.

### 1.2 Core Principles

| Principle | Implementation |
|-----------|---------------|
| **Centralized contracts** | All interfaces in `packages/cityos-design-system/src/` following `CommerceTypes.ts` pattern |
| **Token-driven styling** | Exclusively `ds-*` classes from `packages/cityos-design-tokens/src/`; zero hardcoded colors |
| **RTL-first layout** | Logical CSS properties (`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`) in every component |
| **i18n everywhere** | All UI strings via `t(locale, "namespace.key")` with `en.json`/`fr.json`/`ar.json` |
| **SSR safety** | Client-only logic gated in `useEffect`; route loaders return minimal data |
| **React Query fetching** | All client-side data via React Query hooks; no raw `fetch` in components |
| **Temporal orchestration** | All cross-system integrations through Temporal Cloud workflows |
| **Progressive enhancement** | Backend API → design-system types → components → routes → i18n strings |

### 1.3 File Naming Conventions

```
packages/cityos-design-system/src/<domain>/       → <Domain>Types.ts
apps/storefront/src/components/<domain>/           → kebab-case component files
apps/storefront/src/routes/$tenant/$locale/<route>/ → index.tsx (list), $id.tsx (detail)
apps/storefront/src/lib/hooks/                     → use-<domain>.ts
apps/backend/src/modules/<module>/models/          → kebab-case model files
apps/backend/src/api/store/<domain>/               → route.ts
```

---

## 2. Phase 0: Foundation (Design System Expansion)

**Goal:** Create all type definitions before any UI work begins.
**Duration:** 5 dev days
**Dependencies:** None — this is the foundation for all subsequent phases.

### 2.1 New Type Files in `packages/cityos-design-system/src/`

#### 2.1.1 `auction/AuctionTypes.ts`

```typescript
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
```

#### 2.1.2 `rental/RentalTypes.ts`

```typescript
import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData, RatingProps } from "../commerce/CommerceTypes"

export interface RentalCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  pricePerDay: PriceData
  pricePerWeek?: PriceData
  pricePerMonth?: PriceData
  availableFrom?: string
  availableUntil?: string
  rating?: { average: number; count: number }
  location?: string
  deposit?: PriceData
  condition?: "new" | "like-new" | "good" | "fair"
  variant?: "default" | "compact" | "horizontal"
  onRent?: () => void
}

export interface RentalCalendarProps extends BaseComponentProps {
  productId: string
  availableDates: string[]
  bookedDates: string[]
  selectedRange?: { start: string; end: string }
  minDays?: number
  maxDays?: number
  onRangeSelect: (range: { start: string; end: string }) => void
}

export interface RentalAgreementViewProps extends BaseComponentProps {
  agreementId: string
  status: "pending" | "active" | "returned" | "overdue" | "cancelled"
  product: { id: string; title: string; thumbnail?: string }
  period: { start: string; end: string }
  totalPrice: PriceData
  deposit: PriceData
  terms?: string
}

export interface RentalReturnFormProps extends BaseComponentProps {
  agreementId: string
  onSubmit: (data: { condition: string; notes?: string; photos?: File[] }) => void
  onCancel: () => void
}

export interface DamageClaimProps extends BaseComponentProps {
  claimId: string
  status: "filed" | "reviewing" | "approved" | "denied"
  description: string
  amount?: PriceData
  photos?: string[]
}

export interface RentalPricingTableProps extends BaseComponentProps {
  daily: PriceData
  weekly?: PriceData
  monthly?: PriceData
  deposit?: PriceData
  insurance?: PriceData
  selectedDuration?: number
}
```

#### 2.1.3 `events/EventTypes.ts`

```typescript
import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface EventCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  thumbnail?: MediaField
  date: string
  endDate?: string
  venue?: VenueInfo
  category?: string
  price?: PriceData
  isFree?: boolean
  availableTickets?: number
  totalTickets?: number
  status: "upcoming" | "ongoing" | "ended" | "cancelled" | "sold-out"
  variant?: "default" | "compact" | "featured" | "horizontal"
  onBook?: () => void
}

export interface VenueInfo {
  id: string
  name: string
  address: string
  lat?: number
  lng?: number
  capacity?: number
  image?: MediaField
}

export interface TicketSelectorProps extends BaseComponentProps {
  eventId: string
  ticketTypes: TicketTypeInfo[]
  selectedTickets: Record<string, number>
  maxPerOrder?: number
  onSelectionChange: (selection: Record<string, number>) => void
}

export interface TicketTypeInfo {
  id: string
  name: string
  description?: string
  price: PriceData
  available: number
  maxPerOrder?: number
  benefits?: string[]
}

export interface SeatMapProps extends BaseComponentProps {
  venueId: string
  sections: SeatSection[]
  selectedSeats: string[]
  onSeatSelect: (seatId: string) => void
  onSeatDeselect: (seatId: string) => void
  interactive?: boolean
}

export interface SeatSection {
  id: string
  name: string
  rows: SeatRow[]
  priceCategory?: string
  color?: string
}

export interface SeatRow {
  id: string
  label: string
  seats: Seat[]
}

export interface Seat {
  id: string
  label: string
  status: "available" | "selected" | "reserved" | "unavailable"
  priceCategory?: string
}

export interface EventFilterProps extends BaseComponentProps {
  categories?: string[]
  dateRange?: { start: string; end: string }
  priceRange?: { min: number; max: number }
  location?: string
  onFilterChange: (filters: Record<string, unknown>) => void
}

export interface EventCountdownProps extends BaseComponentProps {
  date: string
  size?: Size
  showDays?: boolean
  showHours?: boolean
  showMinutes?: boolean
  showSeconds?: boolean
  onComplete?: () => void
}
```

#### 2.1.4 `delivery/DeliveryTypes.ts`

```typescript
import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface DeliverySlotPickerProps extends BaseComponentProps {
  availableSlots: DeliverySlot[]
  selectedSlotId?: string
  onSlotSelect: (slotId: string) => void
  variant?: "grid" | "list" | "calendar"
  showPrice?: boolean
}

export interface DeliverySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  price?: PriceData
  type?: "standard" | "express" | "same-day"
  capacity?: number
  remaining?: number
}

export interface TrackingMapProps extends BaseComponentProps {
  orderId: string
  driverLocation?: { lat: number; lng: number }
  destinationLocation: { lat: number; lng: number }
  pickupLocation?: { lat: number; lng: number }
  estimatedArrival?: string
  status: "preparing" | "picked-up" | "in-transit" | "nearby" | "delivered"
  polyline?: string
  height?: string
}

export interface TrackingTimelineProps extends BaseComponentProps {
  events: TrackingEvent[]
  currentStatus: string
  estimatedDelivery?: string
}

export interface TrackingEvent {
  id: string
  status: string
  description: string
  timestamp: string
  location?: string
  icon?: string
}

export interface ReturnRequestFormProps extends BaseComponentProps {
  orderId: string
  items: ReturnableItem[]
  reasons: string[]
  onSubmit: (data: ReturnRequestData) => void
  onCancel: () => void
}

export interface ReturnableItem {
  id: string
  title: string
  thumbnail?: string
  quantity: number
  maxReturnQuantity: number
  price: PriceData
}

export interface ReturnRequestData {
  items: { itemId: string; quantity: number; reason: string }[]
  notes?: string
  preferRefund?: "original" | "store-credit"
  photos?: File[]
}

export interface ExchangeSelectorProps extends BaseComponentProps {
  originalItem: ReturnableItem
  exchangeOptions: ExchangeOption[]
  onSelect: (optionId: string) => void
}

export interface ExchangeOption {
  id: string
  title: string
  variant: string
  thumbnail?: string
  priceDifference?: PriceData
  available: boolean
}

export interface StorePickupSelectorProps extends BaseComponentProps {
  stores: StoreLocation[]
  selectedStoreId?: string
  onStoreSelect: (storeId: string) => void
  showMap?: boolean
}

export interface StoreLocation {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  distance?: string
  pickupAvailable: boolean
  pickupSlots?: DeliverySlot[]
  phone?: string
  hours?: string
}

export interface ExpressDeliveryBadgeProps extends BaseComponentProps {
  type: "same-day" | "express" | "next-day" | "scheduled"
  estimatedTime?: string
  surcharge?: PriceData
  size?: Size
}
```

#### 2.1.5 `payment/PaymentTypes.ts`

```typescript
import type { BaseComponentProps, Size } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface WalletBalanceProps extends BaseComponentProps {
  balance: PriceData
  pendingBalance?: PriceData
  lastUpdated?: string
  size?: Size
  showTopUp?: boolean
  onTopUp?: () => void
}

export interface WalletTransactionProps extends BaseComponentProps {
  transactions: WalletTransaction[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export interface WalletTransaction {
  id: string
  type: "credit" | "debit" | "transfer" | "refund" | "top-up"
  amount: PriceData
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
  counterparty?: string
  reference?: string
}

export interface BNPLSelectorProps extends BaseComponentProps {
  providers: BNPLProvider[]
  orderTotal: PriceData
  selectedProviderId?: string
  onProviderSelect: (providerId: string) => void
  onEligibilityCheck?: () => void
}

export interface BNPLProvider {
  id: string
  name: string
  logo?: string
  installments: number
  interestRate: number
  monthlyPayment: PriceData
  totalPayment: PriceData
  eligible: boolean
  minAmount?: PriceData
  maxAmount?: PriceData
}

export interface InstallmentPickerProps extends BaseComponentProps {
  total: PriceData
  plans: InstallmentPlan[]
  selectedPlanId?: string
  onPlanSelect: (planId: string) => void
}

export interface InstallmentPlan {
  id: string
  installments: number
  monthlyAmount: PriceData
  totalAmount: PriceData
  interestRate: number
  processingFee?: PriceData
  firstPaymentDate?: string
}

export interface StoreCreditWidgetProps extends BaseComponentProps {
  balance: PriceData
  appliedAmount?: PriceData
  onApply?: (amount: number) => void
  onRemove?: () => void
  maxApplicable?: PriceData
}

export interface EscrowStatusProps extends BaseComponentProps {
  escrowId: string
  amount: PriceData
  status: "held" | "released" | "disputed" | "refunded"
  heldSince?: string
  releaseDate?: string
  parties: { buyer: string; seller: string }
}

export interface DisputeFormProps extends BaseComponentProps {
  orderId: string
  reasons: string[]
  onSubmit: (data: { reason: string; description: string; evidence?: File[] }) => void
  onCancel: () => void
}

export interface RefundStatusProps extends BaseComponentProps {
  refundId: string
  amount: PriceData
  status: "requested" | "processing" | "completed" | "denied"
  method: "original" | "store-credit" | "wallet"
  requestedAt: string
  completedAt?: string
  timeline?: { status: string; timestamp: string }[]
}

export interface GiftCardProps extends BaseComponentProps {
  code?: string
  balance: PriceData
  originalAmount: PriceData
  expiresAt?: string
  status: "active" | "redeemed" | "expired" | "disabled"
  recipientEmail?: string
  senderName?: string
  message?: string
}

export interface GiftCardPurchaseFormProps extends BaseComponentProps {
  amounts: number[]
  customAmount?: boolean
  currencyCode: string
  onPurchase: (data: { amount: number; recipientEmail: string; message?: string }) => void
}
```

#### 2.1.6 `membership/MembershipTypes.ts`

```typescript
import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"

export interface MembershipTierCardProps extends BaseComponentProps {
  id: string
  name: string
  description?: string
  price: PriceData
  billingPeriod: "monthly" | "yearly" | "lifetime"
  benefits: MembershipBenefit[]
  isCurrent?: boolean
  isPopular?: boolean
  onSelect?: () => void
  variant?: "default" | "featured" | "compact"
}

export interface MembershipBenefit {
  id: string
  title: string
  description?: string
  icon?: string
  included: boolean
  value?: string
}

export interface MembershipStatusProps extends BaseComponentProps {
  tier: string
  status: "active" | "expired" | "cancelled" | "paused"
  expiresAt?: string
  renewalDate?: string
  benefits: MembershipBenefit[]
  onRenew?: () => void
  onCancel?: () => void
  onUpgrade?: () => void
}

export interface BenefitsListProps extends BaseComponentProps {
  benefits: MembershipBenefit[]
  showAll?: boolean
  maxVisible?: number
  variant?: "list" | "grid" | "compact"
}

export interface MembershipComparisonProps extends BaseComponentProps {
  tiers: MembershipTierCardProps[]
  currentTierId?: string
  onTierSelect: (tierId: string) => void
}

export interface LoyaltyPointsDisplayProps extends BaseComponentProps {
  points: number
  tier?: string
  nextTier?: { name: string; pointsRequired: number }
  pointsToNextTier?: number
  expiringPoints?: { amount: number; expiresAt: string }
  variant?: "compact" | "detailed" | "card"
}

export interface RewardsCatalogProps extends BaseComponentProps {
  rewards: RewardItem[]
  userPoints: number
  onRedeem: (rewardId: string) => void
  loading?: boolean
}

export interface RewardItem {
  id: string
  title: string
  description?: string
  thumbnail?: string
  pointsCost: number
  category?: string
  available: boolean
  expiresAt?: string
}

export interface PointsHistoryProps extends BaseComponentProps {
  entries: PointsEntry[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export interface PointsEntry {
  id: string
  type: "earned" | "redeemed" | "expired" | "adjusted"
  amount: number
  description: string
  timestamp: string
  orderId?: string
}
```

#### 2.1.7 `digital/DigitalTypes.ts`

```typescript
import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface DigitalProductCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  thumbnail?: MediaField
  price: PriceData
  fileType?: string
  fileSize?: string
  format?: string
  previewUrl?: string
  rating?: { average: number; count: number }
  variant?: "default" | "compact" | "detailed"
  onPurchase?: () => void
  onPreview?: () => void
}

export interface DownloadManagerProps extends BaseComponentProps {
  downloads: DownloadItem[]
  loading?: boolean
}

export interface DownloadItem {
  id: string
  title: string
  thumbnail?: string
  purchaseDate: string
  fileType: string
  fileSize: string
  downloadUrl: string
  downloadsRemaining?: number
  expiresAt?: string
  licenseKey?: string
}

export interface LicenseViewerProps extends BaseComponentProps {
  licenseId: string
  licenseKey: string
  productTitle: string
  status: "active" | "expired" | "revoked"
  activations: number
  maxActivations?: number
  issuedAt: string
  expiresAt?: string
}

export interface DigitalLibraryProps extends BaseComponentProps {
  items: DownloadItem[]
  onDownload: (itemId: string) => void
  onViewLicense?: (itemId: string) => void
  loading?: boolean
  filter?: "all" | "available" | "expired"
}

export interface FilePreviewProps extends BaseComponentProps {
  fileUrl: string
  fileType: "pdf" | "image" | "audio" | "video" | "document"
  title?: string
  onClose: () => void
}
```

#### 2.1.8 `content/ContentTypes.ts`

```typescript
import type { BaseComponentProps } from "../components/ComponentTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface BlogPostCardProps extends BaseComponentProps {
  id: string
  title: string
  slug: string
  excerpt?: string
  thumbnail?: MediaField
  author?: { name: string; avatar?: string }
  publishedAt: string
  category?: string
  tags?: string[]
  readingTime?: string
  variant?: "default" | "compact" | "featured" | "horizontal"
}

export interface BlogPostDetailProps extends BaseComponentProps {
  id: string
  title: string
  content: string
  thumbnail?: MediaField
  author?: { name: string; avatar?: string; bio?: string }
  publishedAt: string
  updatedAt?: string
  category?: string
  tags?: string[]
  readingTime?: string
  relatedPosts?: BlogPostCardProps[]
}

export interface BlogSidebarProps extends BaseComponentProps {
  categories?: { name: string; slug: string; count: number }[]
  recentPosts?: BlogPostCardProps[]
  tags?: { name: string; count: number }[]
  searchEnabled?: boolean
}

export interface ArticleSearchProps extends BaseComponentProps {
  onSearch: (query: string) => void
  placeholder?: string
  results?: BlogPostCardProps[]
  loading?: boolean
}

export interface HelpCenterProps extends BaseComponentProps {
  categories: HelpCategory[]
  featuredArticles?: HelpArticle[]
  searchEnabled?: boolean
  onSearch?: (query: string) => void
}

export interface HelpCategory {
  id: string
  title: string
  description?: string
  icon?: string
  articleCount: number
  slug: string
}

export interface HelpArticle {
  id: string
  title: string
  excerpt?: string
  category: string
  slug: string
  helpful?: { yes: number; no: number }
  updatedAt?: string
}

export interface POICardProps extends BaseComponentProps {
  id: string
  name: string
  description?: string
  thumbnail?: MediaField
  category?: string
  address: string
  lat: number
  lng: number
  rating?: { average: number; count: number }
  phone?: string
  hours?: string
  distance?: string
  variant?: "default" | "compact" | "map-popup"
}

export interface POIMapViewProps extends BaseComponentProps {
  pois: POICardProps[]
  center?: { lat: number; lng: number }
  zoom?: number
  selectedPOIId?: string
  onPOISelect?: (id: string) => void
  height?: string
  showSearch?: boolean
  showCategories?: boolean
}

export interface POIDetailProps extends BaseComponentProps {
  poi: POICardProps & {
    fullDescription?: string
    photos?: MediaField[]
    reviews?: { average: number; count: number }
    amenities?: string[]
    website?: string
    socialLinks?: Record<string, string>
  }
}

export interface AnnouncementCardProps extends BaseComponentProps {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "critical" | "promotion"
  publishedAt: string
  expiresAt?: string
  pinned?: boolean
}
```

#### 2.1.9 `identity/IdentityTypes.ts`

```typescript
import type { BaseComponentProps } from "../components/ComponentTypes"

export interface KYCFormProps extends BaseComponentProps {
  currentStep: number
  totalSteps: number
  onSubmit: (data: KYCSubmission) => void
  onBack?: () => void
  onCancel?: () => void
}

export interface KYCSubmission {
  fullName: string
  dateOfBirth: string
  nationality: string
  documentType: "passport" | "national-id" | "drivers-license"
  documentNumber: string
  documentFront?: File
  documentBack?: File
  selfie?: File
  address?: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
}

export interface VerificationStatusProps extends BaseComponentProps {
  status: "not-started" | "pending" | "verified" | "rejected" | "expired"
  type: "kyc" | "age" | "residency" | "identity"
  submittedAt?: string
  verifiedAt?: string
  rejectionReason?: string
  onResubmit?: () => void
}

export interface DocumentUploadProps extends BaseComponentProps {
  label: string
  acceptedTypes: string[]
  maxSize?: number
  preview?: string
  onUpload: (file: File) => void
  onRemove?: () => void
  status?: "idle" | "uploading" | "uploaded" | "error"
  error?: string
}

export interface AgeGateProps extends BaseComponentProps {
  minimumAge: number
  onVerified: () => void
  onDenied?: () => void
  method?: "dob" | "checkbox" | "document"
  title?: string
  description?: string
}

export interface ConsentBannerProps extends BaseComponentProps {
  categories: ConsentCategory[]
  onAcceptAll: () => void
  onRejectAll?: () => void
  onSavePreferences: (preferences: Record<string, boolean>) => void
  showPreferences?: boolean
  privacyPolicyUrl?: string
  position?: "bottom" | "top" | "center"
}

export interface ConsentCategory {
  id: string
  title: string
  description: string
  required: boolean
  defaultEnabled: boolean
}

export interface ConsentPreferencesProps extends BaseComponentProps {
  categories: ConsentCategory[]
  currentPreferences: Record<string, boolean>
  onSave: (preferences: Record<string, boolean>) => void
  onCancel: () => void
}

export interface CredentialCardProps extends BaseComponentProps {
  credentialType: "kyc" | "vendor" | "membership" | "tenant-operator" | "poi" | "marketplace-seller"
  issuer: string
  issuedAt: string
  expiresAt?: string
  status: "valid" | "expired" | "revoked"
  claims?: Record<string, string>
  onPresent?: () => void
  onRevoke?: () => void
}

export interface VerificationBadgeProps extends BaseComponentProps {
  verified: boolean
  type?: "identity" | "business" | "seller" | "premium"
  tooltip?: string
  size?: "sm" | "md" | "lg"
}
```

#### 2.1.10 `social/SocialTypes.ts`

```typescript
import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface ShoppablePostProps extends BaseComponentProps {
  id: string
  media: MediaField
  caption?: string
  author: { name: string; avatar?: string; handle?: string }
  taggedProducts: TaggedProduct[]
  likes?: number
  comments?: number
  postedAt: string
  variant?: "feed" | "grid" | "story"
}

export interface TaggedProduct {
  id: string
  title: string
  price: PriceData
  thumbnail?: string
  position?: { x: number; y: number }
}

export interface SocialSharePanelProps extends BaseComponentProps {
  url: string
  title: string
  description?: string
  image?: string
  platforms?: ("facebook" | "twitter" | "whatsapp" | "telegram" | "email" | "copy")[]
  onShare?: (platform: string) => void
}

export interface LiveShoppingEmbedProps extends BaseComponentProps {
  streamId: string
  streamUrl?: string
  products: TaggedProduct[]
  isLive: boolean
  viewerCount?: number
  hostName?: string
  onProductClick?: (productId: string) => void
}

export interface SocialProofPopupProps extends BaseComponentProps {
  message: string
  productTitle?: string
  customerName?: string
  location?: string
  timestamp?: string
  duration?: number
  position?: "bottom-start" | "bottom-end"
  onDismiss?: () => void
}

export interface ReferralWidgetProps extends BaseComponentProps {
  referralCode: string
  referralLink: string
  reward?: { type: "discount" | "credit" | "points"; value: string }
  referralCount?: number
  onCopyLink?: () => void
  onShare?: (platform: string) => void
}

export interface WishlistGridProps extends BaseComponentProps {
  items: WishlistItem[]
  onRemove?: (itemId: string) => void
  onMoveToCart?: (itemId: string) => void
  onShare?: () => void
  loading?: boolean
  empty?: boolean
}

export interface WishlistItem {
  id: string
  productId: string
  title: string
  thumbnail?: string
  price: PriceData
  inStock: boolean
  addedAt: string
}
```

#### 2.1.11 `campaign/CampaignTypes.ts`

```typescript
import type { BaseComponentProps } from "../components/ComponentTypes"
import type { PriceData } from "../commerce/CommerceTypes"
import type { MediaField } from "../blocks/BlockTypes"

export interface CampaignCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  thumbnail?: MediaField
  goalAmount: PriceData
  raisedAmount: PriceData
  backersCount: number
  daysRemaining: number
  status: "active" | "funded" | "ended" | "cancelled"
  category?: string
  variant?: "default" | "compact" | "featured"
  onBack?: () => void
}

export interface CampaignProgressBarProps extends BaseComponentProps {
  raised: number
  goal: number
  currencyCode: string
  showPercentage?: boolean
  showAmounts?: boolean
  animated?: boolean
}

export interface BackerListProps extends BaseComponentProps {
  backers: Backer[]
  totalBackers: number
  showAmount?: boolean
  limit?: number
}

export interface Backer {
  id: string
  name: string
  avatar?: string
  amount: PriceData
  backedAt: string
  rewardTier?: string
}

export interface RewardTierProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  pledgeAmount: PriceData
  estimatedDelivery?: string
  limitedQuantity?: number
  claimed?: number
  includes?: string[]
  onPledge: (tierId: string) => void
}

export interface FlashSaleCardProps extends BaseComponentProps {
  id: string
  title: string
  thumbnail?: string
  originalPrice: PriceData
  salePrice: PriceData
  discountPercentage: number
  endsAt: string
  quantityTotal?: number
  quantitySold?: number
  variant?: "default" | "compact" | "banner"
}

export interface CountdownTimerProps extends BaseComponentProps {
  endsAt: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "compact" | "segmented"
  showLabels?: boolean
  onComplete?: () => void
}

export interface BundleBuilderProps extends BaseComponentProps {
  bundleId: string
  requiredItems: BundleItem[]
  optionalItems?: BundleItem[]
  totalPrice: PriceData
  savingsAmount?: PriceData
  selectedItems: string[]
  onItemToggle: (itemId: string) => void
  onAddToCart?: () => void
}

export interface BundleItem {
  id: string
  title: string
  thumbnail?: string
  price: PriceData
  required: boolean
  selected: boolean
}

export interface BundleSavingsProps extends BaseComponentProps {
  individualTotal: PriceData
  bundlePrice: PriceData
  savingsAmount: PriceData
  savingsPercentage: number
}

export interface CouponInputProps extends BaseComponentProps {
  onApply: (code: string) => void
  onRemove?: () => void
  appliedCode?: string
  discount?: PriceData
  loading?: boolean
  error?: string
}
```

### 2.2 Additions to Existing `commerce/CommerceTypes.ts`

Add to `packages/cityos-design-system/src/commerce/CommerceTypes.ts`:

```typescript
export interface CompareProductProps extends BaseComponentProps {
  products: ProductCardProps[]
  features: string[]
  onRemoveProduct?: (productId: string) => void
  maxProducts?: number
}

export interface FlashSaleProductProps extends BaseComponentProps {
  product: ProductCardProps
  originalPrice: PriceData
  salePrice: PriceData
  endsAt: string
  quantityRemaining?: number
  quantityTotal?: number
}

export interface BundleCardProps extends BaseComponentProps {
  id: string
  title: string
  description?: string
  items: { id: string; title: string; thumbnail?: string; price: PriceData }[]
  bundlePrice: PriceData
  individualTotal: PriceData
  savingsPercentage: number
  onAddToCart?: () => void
}

export interface QuickBuyButtonProps extends BaseComponentProps {
  productId: string
  variantId?: string
  label?: string
  onQuickBuy: () => void
  loading?: boolean
}

export interface MiniCartProps extends BaseComponentProps {
  items: CartItemProps[]
  subtotal: PriceData
  itemCount: number
  onCheckout: () => void
  onViewCart: () => void
  open: boolean
  onClose: () => void
}
```

### 2.3 Update `packages/cityos-design-system/src/index.ts`

After creating all type files, update the barrel export:

```typescript
// Add to index.ts
export type { /* all auction types */ } from "./auction/AuctionTypes"
export type { /* all rental types */ } from "./rental/RentalTypes"
export type { /* all event types */ } from "./events/EventTypes"
export type { /* all delivery types */ } from "./delivery/DeliveryTypes"
export type { /* all payment types */ } from "./payment/PaymentTypes"
export type { /* all membership types */ } from "./membership/MembershipTypes"
export type { /* all digital types */ } from "./digital/DigitalTypes"
export type { /* all content types */ } from "./content/ContentTypes"
export type { /* all identity types */ } from "./identity/IdentityTypes"
export type { /* all social types */ } from "./social/SocialTypes"
export type { /* all campaign types */ } from "./campaign/CampaignTypes"
```

### 2.4 New Design Tokens

Add to `packages/cityos-design-tokens/src/colors/ColorTokens.ts`:

```typescript
// Semantic tokens for new features
auction: "hsl(280 65% 50%)",       // Purple for auction highlights
auctionForeground: "hsl(0 0% 100%)",
urgency: "hsl(0 84% 60%)",         // Red for countdowns/urgency
urgencyForeground: "hsl(0 0% 100%)",
reward: "hsl(45 93% 47%)",         // Gold for loyalty/rewards
rewardForeground: "hsl(0 0% 0%)",
verified: "hsl(142 76% 36%)",      // Green for verification badges
verifiedForeground: "hsl(0 0% 100%)",
```

Add to `packages/cityos-design-tokens/src/motion/MotionTokens.ts`:

```typescript
// New transitions for countdown and progress animations
countdown: "all var(--motion-duration-slow, 300ms) var(--motion-easing-bounce)",
progress: "width var(--motion-duration-slower, 500ms) var(--motion-easing-easeOut)",
pulse: "opacity var(--motion-duration-slowest, 1000ms) var(--motion-easing-easeInOut)",
```

### 2.5 New i18n Namespace Keys

Add these namespaces to `apps/storefront/src/lib/i18n/locales/en.json` (and corresponding `fr.json`, `ar.json`):

```json
{
  "auction": {
    "place_bid": "Place Bid",
    "current_bid": "Current Bid",
    "buy_now": "Buy Now",
    "bid_history": "Bid History",
    "time_remaining": "Time Remaining",
    "auction_ended": "Auction Ended",
    "you_won": "You Won!",
    "outbid": "You've been outbid",
    "reserve_not_met": "Reserve not met",
    "auto_bid": "Auto Bid",
    "watching": "Watching"
  },
  "rental": {
    "rent_now": "Rent Now",
    "per_day": "per day",
    "per_week": "per week",
    "per_month": "per month",
    "select_dates": "Select Dates",
    "deposit_required": "Deposit Required",
    "return_item": "Return Item",
    "rental_agreement": "Rental Agreement",
    "condition": "Condition",
    "damage_claim": "Report Damage"
  },
  "event": {
    "buy_tickets": "Buy Tickets",
    "select_seats": "Select Seats",
    "event_details": "Event Details",
    "upcoming_events": "Upcoming Events",
    "sold_out": "Sold Out",
    "free_event": "Free",
    "add_to_calendar": "Add to Calendar",
    "venue": "Venue",
    "date_time": "Date & Time"
  },
  "delivery": {
    "select_slot": "Select Delivery Slot",
    "track_order": "Track Order",
    "estimated_arrival": "Estimated Arrival",
    "driver_nearby": "Driver Nearby",
    "delivered": "Delivered",
    "return_request": "Request Return",
    "exchange": "Exchange",
    "store_pickup": "Store Pickup",
    "express_delivery": "Express Delivery",
    "same_day": "Same Day"
  },
  "payment": {
    "wallet_balance": "Wallet Balance",
    "top_up": "Top Up",
    "bnpl": "Buy Now, Pay Later",
    "installments": "Installments",
    "store_credit": "Store Credit",
    "gift_card": "Gift Card",
    "redeem": "Redeem",
    "dispute": "File Dispute",
    "refund_status": "Refund Status",
    "escrow_held": "Payment Held in Escrow"
  },
  "membership": {
    "join_now": "Join Now",
    "current_tier": "Current Tier",
    "upgrade": "Upgrade",
    "benefits": "Benefits",
    "renew": "Renew Membership",
    "points_balance": "Points Balance",
    "redeem_points": "Redeem Points",
    "rewards": "Rewards",
    "tier_progress": "Tier Progress"
  },
  "digital": {
    "download": "Download",
    "my_library": "My Library",
    "license_key": "License Key",
    "downloads_remaining": "Downloads Remaining",
    "preview": "Preview",
    "file_size": "File Size",
    "file_type": "File Type"
  },
  "content": {
    "read_more": "Read More",
    "published": "Published",
    "by_author": "By",
    "categories": "Categories",
    "tags": "Tags",
    "related_posts": "Related Posts",
    "search_help": "Search Help Center",
    "was_helpful": "Was this helpful?",
    "poi_nearby": "Nearby",
    "view_on_map": "View on Map"
  },
  "identity": {
    "verify_identity": "Verify Identity",
    "upload_document": "Upload Document",
    "verification_pending": "Verification Pending",
    "verified": "Verified",
    "age_verification": "Age Verification",
    "consent_settings": "Consent Settings",
    "accept_all": "Accept All",
    "manage_preferences": "Manage Preferences"
  },
  "social": {
    "share": "Share",
    "wishlist": "Wishlist",
    "refer_friend": "Refer a Friend",
    "copy_link": "Copy Link",
    "live_shopping": "Live Shopping",
    "shop_the_look": "Shop the Look"
  },
  "campaign": {
    "back_project": "Back This Project",
    "backers": "Backers",
    "days_remaining": "Days Remaining",
    "goal": "Goal",
    "raised": "Raised",
    "select_reward": "Select Reward",
    "flash_sale": "Flash Sale",
    "limited_time": "Limited Time",
    "bundle_deal": "Bundle Deal",
    "you_save": "You Save",
    "apply_coupon": "Apply Coupon"
  }
}
```

### 2.6 Phase 0 Deliverables Summary

| Deliverable | Count | Location |
|-------------|-------|----------|
| New type files | 11 | `packages/cityos-design-system/src/<domain>/` |
| New types/interfaces | ~80 | Across all new type files |
| Updated type files | 1 | `commerce/CommerceTypes.ts` (5 new types) |
| Updated barrel export | 1 | `packages/cityos-design-system/src/index.ts` |
| New design tokens | 8 | `packages/cityos-design-tokens/src/` |
| New i18n namespaces | 11 | `apps/storefront/src/lib/i18n/locales/*.json` |

---

## 3. Phase 1: Storefront for Existing Backend (Category A — Quick Wins)

**Goal:** Build storefront UI for the ~17 backend models that already have full API coverage.
**Duration:** 25 dev days
**Dependencies:** Phase 0 complete.

### 3.1 Priority P0 — Critical (Must-Have for Launch)

#### 3.1.1 Events & Ticketing

**Backend modules:** `apps/backend/src/modules/events/models/` (`event.ts`, `venue.ts`), `apps/backend/src/modules/event-ticketing/models/` (`ticket.ts`, `ticket-type.ts`, `seat-map.ts`)
**Store API:** `apps/backend/src/api/store/event-ticketing/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/events/index.tsx` — event listing with filters
- `apps/storefront/src/routes/$tenant/$locale/events/$eventId.tsx` — event detail + ticket purchase

**New components** (`apps/storefront/src/components/events/`):
- `event-card.tsx` — uses `EventCardProps` from `EventTypes.ts`
- `event-detail.tsx` — full event info with venue, schedule, gallery
- `ticket-selector.tsx` — uses `TicketSelectorProps`
- `seat-map.tsx` — uses `SeatMapProps` (interactive SVG seat selection)
- `event-filter.tsx` — uses `EventFilterProps`
- `event-countdown.tsx` — uses `EventCountdownProps`
- `index.ts` — barrel export

**API hooks** (`apps/storefront/src/lib/hooks/use-events.ts`):
```typescript
import { useQuery, useMutation } from "@tanstack/react-query"
import { sdk } from "@/lib/api/sdk"

export function useEvents(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => sdk.client.fetch("/store/event-ticketing", { query: filters }),
  })
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId],
    queryFn: () => sdk.client.fetch(`/store/event-ticketing/${eventId}`),
    enabled: !!eventId,
  })
}

export function usePurchaseTicket() {
  return useMutation({
    mutationFn: (data: { eventId: string; tickets: Record<string, number> }) =>
      sdk.client.fetch("/store/event-ticketing/purchase", { method: "POST", body: data }),
  })
}
```

**Design system types:** `EventCardProps`, `TicketSelectorProps`, `SeatMapProps`, `EventFilterProps`, `EventCountdownProps`
**i18n keys:** `event.*` namespace
**Temporal workflows:** `commerce-queue` — ticket reservation hold, payment confirmation, seat release on timeout

#### 3.1.2 Memberships & VIP Commerce

**Backend module:** `apps/backend/src/modules/membership/models/` (`membership.ts`)
**Store API:** `apps/backend/src/api/store/memberships/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/memberships/index.tsx` — tier comparison & signup
- `apps/storefront/src/routes/$tenant/$locale/account/memberships/index.tsx` — membership management

**New components** (`apps/storefront/src/components/memberships/`):
- `membership-tier-card.tsx` — uses `MembershipTierCardProps`
- `membership-comparison.tsx` — uses `MembershipComparisonProps`
- `membership-status.tsx` — uses `MembershipStatusProps`
- `benefits-list.tsx` — uses `BenefitsListProps`
- `index.ts`

**API hooks** (`apps/storefront/src/lib/hooks/use-memberships.ts`):
```typescript
export function useMemberships() {
  return useQuery({
    queryKey: ["memberships"],
    queryFn: () => sdk.client.fetch("/store/memberships"),
  })
}

export function useMyMembership() {
  return useQuery({
    queryKey: ["memberships", "me"],
    queryFn: () => sdk.client.fetch("/store/memberships/me"),
  })
}
```

**Design system types:** `MembershipTierCardProps`, `MembershipStatusProps`, `BenefitsListProps`, `MembershipComparisonProps`
**i18n keys:** `membership.*` namespace
**Temporal workflows:** `commerce-queue` — membership activation, renewal reminder, tier upgrade processing

### 3.2 Priority P1 — High (Marketplace Differentiation)

#### 3.2.1 Auctions

**Backend module:** `apps/backend/src/modules/auction/models/` (`auction-listing.ts`, `bid.ts`, `auto-bid-rule.ts`, `auction-escrow.ts`, `auction-result.ts`)
**Store API:** `apps/backend/src/api/store/auctions/route.ts`, `apps/backend/src/api/store/auctions/[id]/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/auctions/index.tsx` — auction browsing
- `apps/storefront/src/routes/$tenant/$locale/auctions/$auctionId.tsx` — live auction detail + bidding

**New components** (`apps/storefront/src/components/auctions/`):
- `auction-card.tsx` — uses `AuctionCardProps`
- `bid-panel.tsx` — uses `BidPanelProps`
- `auction-countdown.tsx` — uses `AuctionCountdownProps`
- `bid-history.tsx` — uses `BidHistoryProps`
- `auction-filter.tsx` — uses `AuctionFilterProps`
- `auction-result.tsx` — uses `AuctionResultProps`
- `index.ts`

**API hooks** (`apps/storefront/src/lib/hooks/use-auctions.ts`):
```typescript
export function useAuctions(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["auctions", filters],
    queryFn: () => sdk.client.fetch("/store/auctions", { query: filters }),
  })
}

export function useAuction(auctionId: string) {
  return useQuery({
    queryKey: ["auctions", auctionId],
    queryFn: () => sdk.client.fetch(`/store/auctions/${auctionId}`),
    enabled: !!auctionId,
    refetchInterval: 5000, // Poll for bid updates
  })
}

export function usePlaceBid() {
  return useMutation({
    mutationFn: (data: { auctionId: string; amount: number }) =>
      sdk.client.fetch(`/store/auctions/${data.auctionId}/bid`, { method: "POST", body: data }),
  })
}
```

**Design system types:** All `AuctionTypes.ts` types
**i18n keys:** `auction.*` namespace
**Temporal workflows:** `commerce-queue` — bid processing, auction end notification, escrow hold/release, auto-extend timer

#### 3.2.2 Rentals

**Backend module:** `apps/backend/src/modules/rental/models/` (`rental-product.ts`, `rental-agreement.ts`, `rental-period.ts`, `rental-return.ts`, `damage-claim.ts`)
**Store API:** `apps/backend/src/api/store/rentals/route.ts`, `apps/backend/src/api/store/rentals/[id]/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/rentals/index.tsx` — rental product browsing
- `apps/storefront/src/routes/$tenant/$locale/rentals/$rentalId.tsx` — rental detail + calendar
- `apps/storefront/src/routes/$tenant/$locale/account/rentals/index.tsx` — my active rentals

**New components** (`apps/storefront/src/components/rentals/`):
- `rental-card.tsx` — uses `RentalCardProps`
- `rental-calendar.tsx` — uses `RentalCalendarProps`
- `rental-agreement-view.tsx` — uses `RentalAgreementViewProps`
- `rental-return-form.tsx` — uses `RentalReturnFormProps`
- `rental-pricing-table.tsx` — uses `RentalPricingTableProps`
- `damage-claim.tsx` — uses `DamageClaimProps`
- `index.ts`

**API hooks** (`apps/storefront/src/lib/hooks/use-rentals.ts`)
**Design system types:** All `RentalTypes.ts` types
**i18n keys:** `rental.*` namespace
**Temporal workflows:** `commerce-queue` — rental agreement creation, return deadline reminders, late return processing, damage claim resolution

#### 3.2.3 Digital Products & Downloads

**Backend module:** `apps/backend/src/modules/digital-product/models/` (`digital-asset.ts`, `download-license.ts`)
**Store API:** `apps/backend/src/api/store/digital-products/route.ts`, `apps/backend/src/api/store/digital-products/[id]/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/digital/index.tsx` — digital product catalog
- `apps/storefront/src/routes/$tenant/$locale/digital/$productId.tsx` — digital product detail + preview
- `apps/storefront/src/routes/$tenant/$locale/account/downloads/index.tsx` — download library

**New components** (`apps/storefront/src/components/digital/`):
- `digital-product-card.tsx` — uses `DigitalProductCardProps`
- `download-manager.tsx` — uses `DownloadManagerProps`
- `license-viewer.tsx` — uses `LicenseViewerProps`
- `digital-library.tsx` — uses `DigitalLibraryProps`
- `file-preview.tsx` — uses `FilePreviewProps`
- `index.ts`

**API hooks** (`apps/storefront/src/lib/hooks/use-digital-products.ts`)
**Design system types:** All `DigitalTypes.ts` types
**i18n keys:** `digital.*` namespace
**Temporal workflows:** `commerce-queue` — license generation, download link expiry, re-download authorization

#### 3.2.4 Crowdfunding / Pre-order Campaigns

**Backend module:** `apps/backend/src/modules/crowdfunding/models/`
**Store API:** `apps/backend/src/api/store/crowdfunding/route.ts`, `apps/backend/src/api/store/crowdfunding/[id]/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/campaigns/index.tsx` — campaign browsing
- `apps/storefront/src/routes/$tenant/$locale/campaigns/$campaignId.tsx` — campaign detail + backing

**New components** (`apps/storefront/src/components/campaigns/`):
- `campaign-card.tsx` — uses `CampaignCardProps`
- `campaign-progress-bar.tsx` — uses `CampaignProgressBarProps`
- `backer-list.tsx` — uses `BackerListProps`
- `reward-tier.tsx` — uses `RewardTierProps`
- `index.ts`

**API hooks** (`apps/storefront/src/lib/hooks/use-campaigns.ts`)
**Design system types:** All relevant `CampaignTypes.ts` types
**i18n keys:** `campaign.*` namespace
**Temporal workflows:** `commerce-queue` — campaign deadline, funding threshold check, reward fulfillment

#### 3.2.5 Flash Sales / Daily Deals

**Backend module:** `apps/backend/src/modules/promotion-ext/models/`
**Store API:** `apps/backend/src/api/store/products/route.ts` (with flash sale filter)

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/flash-sales/index.tsx` — active deals listing

**New components** (`apps/storefront/src/components/flash-sales/`):
- `flash-sale-card.tsx` — uses `FlashSaleCardProps`
- `countdown-timer.tsx` — uses `CountdownTimerProps`
- `urgency-banner.tsx` — stock/time urgency indicator
- `index.ts`

**Design system types:** `FlashSaleCardProps`, `CountdownTimerProps` from `CampaignTypes.ts`
**i18n keys:** `campaign.flash_sale`, `campaign.limited_time`

#### 3.2.6 Bundling Commerce

**Backend model:** `product-bundle.ts` exists in product module

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/bundles/index.tsx` — bundle deals listing
- `apps/storefront/src/routes/$tenant/$locale/bundles/$bundleId.tsx` — bundle configurator

**New components** (`apps/storefront/src/components/bundles/`):
- `bundle-card.tsx` — uses `BundleCardProps` from `CommerceTypes.ts`
- `bundle-builder.tsx` — uses `BundleBuilderProps` from `CampaignTypes.ts`
- `bundle-savings.tsx` — uses `BundleSavingsProps`
- `index.ts`

**Design system types:** `BundleCardProps`, `BundleBuilderProps`, `BundleSavingsProps`
**i18n keys:** `campaign.bundle_deal`, `campaign.you_save`

#### 3.2.7 Gift Cards & Vouchers

**Backend model:** `gift-card-ext.ts` extends Medusa core
**Store API:** Medusa core gift card endpoints

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/gift-cards/index.tsx` — gift card purchase
- `apps/storefront/src/routes/$tenant/$locale/account/gift-cards/index.tsx` — my gift cards

**New components** (`apps/storefront/src/components/gift-cards/`):
- `gift-card-purchase-form.tsx` — uses `GiftCardPurchaseFormProps`
- `gift-card-card.tsx` — uses `GiftCardProps`
- `gift-card-redeem.tsx` — redemption form
- `index.ts`

**Design system types:** `GiftCardProps`, `GiftCardPurchaseFormProps` from `PaymentTypes.ts`
**i18n keys:** `payment.gift_card`, `payment.redeem`

#### 3.2.8 Loyalty & Rewards

**Backend models:** `loyalty-program.ts`, `loyalty-points-ledger.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/account/loyalty/index.tsx` — points dashboard

**New components** (`apps/storefront/src/components/loyalty/`):
- `loyalty-points-display.tsx` — uses `LoyaltyPointsDisplayProps`
- `rewards-catalog.tsx` — uses `RewardsCatalogProps`
- `points-history.tsx` — uses `PointsHistoryProps`
- `index.ts`

**Design system types:** `LoyaltyPointsDisplayProps`, `RewardsCatalogProps`, `PointsHistoryProps` from `MembershipTypes.ts`
**i18n keys:** `membership.points_balance`, `membership.redeem_points`, `membership.rewards`

### 3.3 Priority P2 — Medium (Valuable Add-ons)

#### 3.3.1 Social Commerce Storefront

**Backend module:** `apps/backend/src/modules/social-commerce/models/`
**Store API:** `apps/backend/src/api/store/social-commerce/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/social/index.tsx` — shoppable feed

**New components** (`apps/storefront/src/components/social/`):
- `shoppable-post.tsx` — uses `ShoppablePostProps`
- `social-share-panel.tsx` — uses `SocialSharePanelProps`
- `live-shopping-embed.tsx` — uses `LiveShoppingEmbedProps`
- `referral-widget.tsx` — uses `ReferralWidgetProps`
- `wishlist-grid.tsx` — uses `WishlistGridProps`
- `index.ts`

#### 3.3.2 Affiliate Dashboard

**Backend module:** `apps/backend/src/modules/affiliate/models/`
**Store API:** `apps/backend/src/api/store/affiliates/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/account/affiliate/index.tsx` — affiliate dashboard
- `apps/storefront/src/routes/$tenant/$locale/account/affiliate/links.tsx` — referral links management

**New components** (`apps/storefront/src/components/affiliate/`):
- `affiliate-dashboard.tsx` — earnings, clicks, conversions
- `referral-link-manager.tsx` — generate/manage referral links
- `commission-history.tsx` — commission transaction list
- `index.ts`

#### 3.3.3 Escrow Payment Status

**Backend model:** `auction-escrow.ts`, payout module
**New components** in `apps/storefront/src/components/payments/`:
- `escrow-status.tsx` — uses `EscrowStatusProps`

#### 3.3.4 Installment Plans UI

**Backend module:** `apps/backend/src/modules/financial-product/models/`
**New components** in `apps/storefront/src/components/payments/`:
- `installment-picker.tsx` — uses `InstallmentPickerProps`

#### 3.3.5 Store Credits UI

**New components** in `apps/storefront/src/components/payments/`:
- `store-credit-widget.tsx` — uses `StoreCreditWidgetProps`

#### 3.3.6 KYC / Identity Verification

**Backend integration:** `apps/backend/src/integrations/waltid/`
**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/verify/index.tsx` — verification portal

**New components** (`apps/storefront/src/components/identity/`):
- `kyc-form.tsx` — uses `KYCFormProps`
- `document-upload.tsx` — uses `DocumentUploadProps`
- `verification-status.tsx` — uses `VerificationStatusProps`
- `credential-card.tsx` — uses `CredentialCardProps`
- `verification-badge.tsx` — uses `VerificationBadgeProps`
- `index.ts`

**Temporal workflows:** `identity-queue` — KYC document verification via Walt.id, credential issuance

#### 3.3.7 POI Browsing

**Backend model:** `tenant-poi.ts` in tenant module
**Store API:** `apps/backend/src/api/platform/vendors/[id]/pois/route.ts`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/poi/index.tsx` — POI map + list browse
- `apps/storefront/src/routes/$tenant/$locale/poi/$poiId.tsx` — POI detail

**New components** (`apps/storefront/src/components/poi/`):
- `poi-card.tsx` — uses `POICardProps`
- `poi-map-view.tsx` — uses `POIMapViewProps`
- `poi-detail.tsx` — uses `POIDetailProps`
- `poi-category-filter.tsx`
- `index.ts`

### 3.4 Phase 1 Route Pattern Reference

All new routes follow this pattern (example from existing `bookings/index.tsx`):

```typescript
import { createFileRoute } from "@tanstack/react-router"
import { useAuctions } from "@/lib/hooks/use-auctions"

export const Route = createFileRoute("/$tenant/$locale/auctions/")({
  component: AuctionsPage,
})

function AuctionsPage() {
  const { tenant, locale } = Route.useParams()
  const { data: auctions, isLoading, error } = useAuctions()

  return (
    <div className="min-h-screen bg-ds-muted">
      <section className="bg-ds-primary text-ds-primary-foreground py-20">
        <div className="content-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t(locale, "auction.browse_auctions")}
          </h1>
        </div>
      </section>
      <section className="py-16">
        <div className="content-container">
          {isLoading ? <LoadingSkeleton /> : <AuctionGrid auctions={auctions} />}
        </div>
      </section>
    </div>
  )
}
```

### 3.5 Phase 1 Deliverables Summary

| Area | Count |
|------|-------|
| New routes | 18 |
| New component directories | 12 |
| New component files | ~50 |
| New hook files | 10 |
| New i18n keys | ~120 |

---

## 4. Phase 2: Logistics & Delivery UX (Category C — High Customer Impact)

**Goal:** Build comprehensive delivery, tracking, and returns experience.
**Duration:** 15 dev days
**Dependencies:** Phase 0 complete. Fleetbase integration active via Temporal.

### 4.1 Delivery Slots & Scheduling

**Backend enhancement needed:** Create delivery slot scheduling logic (can leverage existing `booking` module patterns).

**New routes:**
- Integration into `apps/storefront/src/routes/$tenant/$locale/checkout.tsx` — add delivery slot step

**New components** (`apps/storefront/src/components/delivery/`):
- `delivery-slot-picker.tsx` — uses `DeliverySlotPickerProps`
  - Calendar grid showing available 2-hour windows
  - Express/same-day highlighting with surcharge display
  - Mobile-responsive: horizontal scroll on small screens
- `delivery-scheduler.tsx` — full scheduling experience with date + time
- `express-delivery-badge.tsx` — uses `ExpressDeliveryBadgeProps`
- `index.ts`

**API hooks** (`apps/storefront/src/lib/hooks/use-delivery.ts`):
```typescript
export function useDeliverySlots(params: { date: string; postalCode: string }) {
  return useQuery({
    queryKey: ["delivery-slots", params],
    queryFn: () => sdk.client.fetch("/store/delivery-slots", { query: params }),
    enabled: !!params.date && !!params.postalCode,
  })
}
```

**Temporal workflows:** `xsystem-logistics-queue` — slot reservation, capacity management, Fleetbase driver assignment

### 4.2 Real-Time Tracking

**Backend integration:** `apps/backend/src/integrations/fleetbase/` already provides tracking data.

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/track/index.tsx` — standalone tracking by order ID
- Enhancement of `apps/storefront/src/routes/$tenant/$locale/account/orders/$id.track.tsx`

**New components** (add to `apps/storefront/src/components/orders/`):
- `tracking-map.tsx` — uses `TrackingMapProps`
  - Lazy-loaded map component (Mapbox/Leaflet)
  - SSR-safe: map initialized in `useEffect`
  - Polls driver location every 10s via React Query `refetchInterval`
  - Shows driver → destination polyline
- `tracking-timeline.tsx` — uses `TrackingTimelineProps`
  - Vertical timeline with status icons
  - Real-time updates via polling

**Temporal workflows:** `xsystem-logistics-queue` — Fleetbase location polling, ETA calculation, delivery confirmation

### 4.3 Returns & Exchanges

**Enhancement of existing:** `apps/storefront/src/routes/$tenant/$locale/account/orders/$id.return.tsx`

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/returns/index.tsx` — standalone returns center

**New components** (add to `apps/storefront/src/components/orders/`):
- `return-request-form.tsx` — uses `ReturnRequestFormProps`
  - Multi-item selection with quantities
  - Reason dropdown per item
  - Photo upload for damaged items
  - Refund method selection (original payment vs store credit)
- `exchange-selector.tsx` — uses `ExchangeSelectorProps`
  - Shows available size/color variants for exchange
  - Price difference handling
- `return-label.tsx` — printable return shipping label

**Temporal workflows:** `xsystem-logistics-queue` — return label generation via Fleetbase, refund processing, exchange order creation

### 4.4 Same-Day / Express Delivery

**Enhancement of checkout flow:**

**New components** (in `apps/storefront/src/components/delivery/`):
- `express-delivery-badge.tsx` — uses `ExpressDeliveryBadgeProps`
- Express option in shipping method selector with time guarantee display
- Surcharge calculation display

### 4.5 Store Pickup (BOPIS)

**New components** (in `apps/storefront/src/components/delivery/`):
- `store-pickup-selector.tsx` — uses `StorePickupSelectorProps`
  - Map view of nearby stores with availability
  - Pickup slot scheduling
  - Estimated preparation time
- `pickup-qr-code.tsx` — QR code for in-store pickup verification (client-side generation in `useEffect`)

**Integration into checkout:** Add "Store Pickup" as delivery option alongside shipping methods.

### 4.6 Phase 2 Deliverables Summary

| Area | Count |
|------|-------|
| New routes | 2 |
| Enhanced routes | 2 |
| New component files | ~12 |
| New hook files | 2 |
| Checkout flow enhancements | 3 (slot picker, BOPIS, express) |

---

## 5. Phase 3: Payment & Financial Models (Category C — Revenue Enablers)

**Goal:** Implement full payment diversity — wallet, BNPL, installments, credits, escrow, disputes.
**Duration:** 18 dev days
**Dependencies:** Phase 0 complete. Stripe integration active.

### 5.1 Digital Wallet

**Backend needed:** New `wallet` module (entity, service, API routes).

**Backend module pattern** (`apps/backend/src/modules/wallet/`):
```
models/
  wallet.ts           — id, customer_id, tenant_id, balance, currency_code, status
  wallet-transaction.ts — id, wallet_id, type, amount, description, reference, status
service.ts
index.ts
migrations/
```

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/account/wallet/index.tsx` — wallet dashboard

**New components** (`apps/storefront/src/components/payments/`):
- `wallet-balance.tsx` — uses `WalletBalanceProps`
- `wallet-transactions.tsx` — uses `WalletTransactionProps`
- `wallet-top-up-form.tsx` — amount selection + Stripe payment
- Integration into checkout as payment method

**Temporal workflows:** `xsystem-payment-queue` — top-up via Stripe, P2P transfers, balance deductions

### 5.2 BNPL (Buy Now, Pay Later)

**Backend needed:** BNPL integration configuration (Stripe BNPL, Klarna, Tabby).

**New components** (`apps/storefront/src/components/payments/`):
- `bnpl-selector.tsx` — uses `BNPLSelectorProps`
  - Provider logos (Klarna, Tabby, etc.)
  - Eligibility check on cart total
  - Installment breakdown preview
- Integration into `checkout-payment-step.tsx`

**Temporal workflows:** `xsystem-payment-queue` — eligibility verification, payment plan creation

### 5.3 Installment Plans

**Backend module:** `apps/backend/src/modules/financial-product/models/`

**New components** (`apps/storefront/src/components/payments/`):
- `installment-picker.tsx` — uses `InstallmentPickerProps`
  - 3/6/12 month plan comparison
  - Monthly payment calculator
  - Interest/fee disclosure
- Display on product detail page and checkout

### 5.4 Store Credits

**New components** (`apps/storefront/src/components/payments/`):
- `store-credit-widget.tsx` — uses `StoreCreditWidgetProps`
  - Balance display in account section
  - Apply/remove at checkout
  - Partial application (use $X of $Y balance)

### 5.5 Escrow Payments

**Backend model:** `auction-escrow.ts`, `payout` module

**New components** (`apps/storefront/src/components/payments/`):
- `escrow-status.tsx` — uses `EscrowStatusProps`
  - Visual timeline: held → inspecting → released/disputed
  - Buyer/seller views

**Temporal workflows:** `xsystem-payment-queue` — escrow hold on purchase, release on confirmation, dispute initiation

### 5.6 Gift Cards & Vouchers

See Phase 1, Section 3.2.7. Additional checkout integration:
- Gift card balance check at checkout
- Partial gift card application
- Gift card as payment method option

### 5.7 Disputes & Refunds

**Backend needed:** Formal `dispute` module.

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/account/orders/$orderId.dispute.tsx` — dispute filing

**New components** (`apps/storefront/src/components/payments/`):
- `dispute-form.tsx` — uses `DisputeFormProps`
  - Reason selection
  - Description text area
  - Evidence file upload (photos, screenshots)
- `refund-status.tsx` — uses `RefundStatusProps`
  - Status timeline
  - Refund method indicator

**Temporal workflows:** `xsystem-payment-queue` — dispute creation, evidence review workflow, Stripe refund processing

### 5.8 Phase 3 Deliverables Summary

| Area | Count |
|------|-------|
| New backend modules | 2 (wallet, dispute) |
| New routes | 2 |
| New component files | ~14 |
| Checkout enhancements | 4 (wallet, BNPL, installments, credits) |
| New Temporal workflows | ~8 |

---

## 6. Phase 4: Missing Commerce Models (Category B — Differentiators)

**Goal:** Build entirely new backend modules and storefronts for models that don't yet exist.
**Duration:** 22 dev days
**Dependencies:** Phase 0, Phase 1 complete.

### 6.1 Try-Before-You-Buy (TBYB)

**Backend module to create** (`apps/backend/src/modules/tbyb/`):
```
models/
  tbyb-trial.ts       — id, customer_id, product_id, trial_start, trial_end, status, auto_charge
  tbyb-config.ts      — id, product_id, trial_days, deposit_amount, auto_charge_enabled
service.ts
index.ts
migrations/
```

**API routes:**
- `apps/backend/src/api/store/tbyb/route.ts` — GET eligible products
- `apps/backend/src/api/store/tbyb/[id]/route.ts` — GET trial status, POST start trial
- `apps/backend/src/api/admin/tbyb/route.ts` — CRUD configuration

**New routes:**
- Product detail enhancement: "Try Before You Buy" option on eligible products
- `apps/storefront/src/routes/$tenant/$locale/account/trials/index.tsx` — active trials management

**Temporal workflows:** `commerce-queue` — trial period tracking, auto-charge on trial end, return processing

### 6.2 Consignment

**Backend module to create** (`apps/backend/src/modules/consignment/`):
```
models/
  consignment-agreement.ts — id, consignor_id, tenant_id, terms, commission_rate, status
  consignment-item.ts      — id, agreement_id, product_id, asking_price, status, sold_price
  consignment-settlement.ts — id, agreement_id, total_sales, commission, net_payout, status
service.ts
index.ts
migrations/
```

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/consignment/index.tsx` — consignment info + submission
- `apps/storefront/src/routes/$tenant/$locale/account/consignment/index.tsx` — consignor dashboard

**Temporal workflows:** `commerce-queue` — settlement calculation, payout scheduling

### 6.3 Trade-In / Recommerce

**Backend enhancement:** Extend `classified` module with trade-in valuation.

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/trade-in/index.tsx` — trade-in wizard

**New components** (`apps/storefront/src/components/trade-in/`):
- `condition-grader.tsx` — interactive condition assessment (select from conditions with photo upload)
- `value-calculator.tsx` — real-time trade-in value estimation
- `trade-in-summary.tsx` — review before submission

### 6.4 Referral Commerce

**Backend module:** Affiliate module already has `referral.ts`, `referral-link.ts`.

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/refer/index.tsx` — referral landing page

**New components** (`apps/storefront/src/components/referral/`):
- `referral-widget.tsx` — uses `ReferralWidgetProps`
- `referral-progress.tsx` — rewards earned, referral count
- Integration: referral banner in account dashboard

### 6.5 Enhanced Loyalty & Rewards

**Backend needed:** Promote `loyalty-program.ts` and `loyalty-points-ledger.ts` to full module.

Covered in Phase 1 Section 3.2.8 for storefront components.

### 6.6 Flash Sales (Enhanced)

Covered in Phase 1 Section 3.2.5. Additional backend:
- Flash sale scheduling in `promotion-ext` module
- Inventory hold during flash sale duration
- Real-time stock counter

### 6.7 Bundling (Enhanced)

Covered in Phase 1 Section 3.2.6. Additional backend:
- Dynamic bundle pricing rules
- Cross-sell bundle suggestions

### 6.8 Campaigns & Promotions

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/promotions/index.tsx` — active promotions page

**New components** (in `apps/storefront/src/components/campaigns/`):
- `coupon-input.tsx` — uses `CouponInputProps`
  - Apply/remove coupon in cart
  - Validation feedback
- `promotion-banner.tsx` — site-wide promotion banner

### 6.9 Phase 4 Deliverables Summary

| Area | Count |
|------|-------|
| New backend modules | 3 (TBYB, consignment, trade-in valuation) |
| Enhanced backend modules | 2 (loyalty, promotion-ext) |
| New routes | 6 |
| New component directories | 3 |
| New component files | ~20 |

---

## 7. Phase 5: Content & Identity Enhancement

**Goal:** Complete content management storefront and identity verification UX.
**Duration:** 15 dev days
**Dependencies:** Phase 0 complete.

### 7.1 Blog & Articles

**Backend needed:** Blog models in CMS registry or new content module.

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/blog/index.tsx` — blog listing with pagination
- `apps/storefront/src/routes/$tenant/$locale/blog/$slug.tsx` — blog post detail

**New components** (`apps/storefront/src/components/content/`):
- `blog-post-card.tsx` — uses `BlogPostCardProps`
- `blog-post-detail.tsx` — uses `BlogPostDetailProps`
- `blog-sidebar.tsx` — uses `BlogSidebarProps`
- `article-search.tsx` — uses `ArticleSearchProps`
- `index.ts`

**i18n keys:** `content.read_more`, `content.published`, `content.by_author`, `content.categories`, `content.tags`, `content.related_posts`

### 7.2 FAQ & Help Center

**Leverages existing:** `FAQBlockData` in `BlockTypes.ts`, `FAQBlock` component.

**New routes:**
- `apps/storefront/src/routes/$tenant/$locale/help/index.tsx` — help center home
- `apps/storefront/src/routes/$tenant/$locale/help/$categorySlug.tsx` — category articles
- `apps/storefront/src/routes/$tenant/$locale/faq/index.tsx` — standalone FAQ (can reuse `FAQBlock`)

**New components** (`apps/storefront/src/components/help/`):
- `help-center.tsx` — uses `HelpCenterProps`
- `help-category-card.tsx` — uses `HelpCategory` type
- `help-article-card.tsx` — uses `HelpArticle` type
- `help-search.tsx` — search with instant results
- `index.ts`

### 7.3 POI (Points of Interest)

Covered in Phase 1 Section 3.3.7.

### 7.4 Age Verification

**New components** (`apps/storefront/src/components/identity/`):
- `age-gate.tsx` — uses `AgeGateProps`
  - Full-screen overlay for age-restricted products
  - DOB input or checkbox confirmation
  - SSR-safe: gate rendered in `useEffect` check

### 7.5 Consent Management

**New components** (`apps/storefront/src/components/consent/`):
- `cookie-banner.tsx` — uses `ConsentBannerProps`
  - Fixed bottom/top banner
  - Accept all / Manage preferences
  - Persists to `localStorage` (SSR-safe via `useEffect`)
- `consent-preferences.tsx` — uses `ConsentPreferencesProps`
  - Modal with category toggles
  - Required categories grayed out
- Integration: Banner injected in root layout

### 7.6 Static Content Pages

**New routes (leveraging CMS catch-all or dedicated):**
- `apps/storefront/src/routes/$tenant/$locale/about/index.tsx` — about page (can render CMS blocks)
- `apps/storefront/src/routes/$tenant/$locale/contact/index.tsx` — contact form (uses `ContactFormBlock`)
- `apps/storefront/src/routes/$tenant/$locale/announcements/index.tsx` — announcements listing
- `apps/storefront/src/routes/$tenant/$locale/compare/index.tsx` — product comparison page
- `apps/storefront/src/routes/$tenant/$locale/explore/index.tsx` — explore/discover page

**Note:** Many of these can be served by the existing CMS catch-all `$slug.tsx` route with appropriate CMS page configuration. Dedicated routes are only needed for pages requiring custom logic.

### 7.7 Phase 5 Deliverables Summary

| Area | Count |
|------|-------|
| New routes | 8 |
| New component directories | 3 (content, help, consent) |
| New component files | ~15 |
| CMS page configurations | 5 |

---

## 8. Phase 6: Advanced UI Patterns

**Goal:** Implement missing patterns from Part VII of the design document reference.
**Duration:** 18 dev days
**Dependencies:** Phase 0 complete. Phases 1-5 provide data/hooks.

### 8.1 Navigation Patterns

**Mega Menu** — enhance existing `apps/storefront/src/components/navbar.tsx`:
- Multi-column dropdown with category images
- Featured product/vendor highlights
- Search integration

**Command Palette** — new component:
- `apps/storefront/src/components/search/command-palette.tsx`
- Keyboard shortcut (Cmd+K / Ctrl+K)
- Global search across products, vendors, categories, pages
- SSR-safe: initialized in `useEffect`

**Sidebar Navigation** — enhance existing `SidebarProps` in `NavigationTypes.ts`:
- Collapsible with persistent state
- Mobile slide-out drawer
- Active state tracking

### 8.2 Product Patterns

**Comparison Table** — new component:
- `apps/storefront/src/components/products/product-comparison.tsx`
- Uses `CompareProductProps` from enhanced `CommerceTypes.ts`
- Side-by-side feature comparison
- Max 4 products, responsive collapse on mobile

**360° Product Viewer** — new component:
- `apps/storefront/src/components/products/product-360-viewer.tsx`
- Image sequence rotation with drag/swipe
- Lazy-loaded, SSR-safe (canvas in `useEffect`)

**AR Preview** — future enhancement:
- WebXR API integration
- AR Quick Look for iOS, SceneViewer for Android
- Placeholder component with "View in AR" button

### 8.3 Cart & Checkout Patterns

**Mini Cart** — new component:
- `apps/storefront/src/components/cart/mini-cart.tsx`
- Uses `MiniCartProps` from enhanced `CommerceTypes.ts`
- Slide-out drawer triggered by cart icon
- Quick quantity adjust + remove

**One-Click Buy** — new component:
- `apps/storefront/src/components/products/quick-buy-button.tsx`
- Uses `QuickBuyButtonProps` from enhanced `CommerceTypes.ts`
- Saved payment method + default address

**Checkout Steps Enhancement:**
- Progress indicator improvement
- Guest checkout optimization
- Address autocomplete (Fleetbase geocoding via Temporal)

### 8.4 Interactive Patterns

**Infinite Scroll** — utility hook:
- `apps/storefront/src/lib/hooks/use-infinite-scroll.ts`
- Intersection Observer based
- SSR-safe with `useEffect`
- Integration with React Query `useInfiniteQuery`

**Drag & Drop** — utility component:
- `apps/storefront/src/components/ui/sortable-list.tsx`
- For wishlist ordering, cart item reordering
- Touch-friendly

### 8.5 Marketing Patterns

**Social Proof Popups** — new component:
- `apps/storefront/src/components/social/social-proof-popup.tsx`
- Uses `SocialProofPopupProps` from `SocialTypes.ts`
- "X just purchased Y" notifications
- SSR-safe: interval in `useEffect`

**Exit Intent** — utility hook:
- `apps/storefront/src/lib/hooks/use-exit-intent.ts`
- Mouse leave detection (desktop only)
- Triggers discount modal or newsletter signup

**Urgency Banners** — new component:
- `apps/storefront/src/components/campaigns/urgency-banner.tsx`
- Low stock indicator
- Limited time deal countdown
- Uses `CountdownTimerProps`

### 8.6 Trust Patterns

**Trust Badges** — existing `TrustBadgesBlock` covers this.

**Security Seals** — footer/checkout component:
- SSL seal, payment provider logos, return guarantee badge
- Can use existing `TrustBadgeItem` type

**Review Aggregation** — enhancement of reviews:
- `apps/storefront/src/components/reviews/review-aggregation.tsx`
- Star distribution chart
- Review summary with pros/cons
- Photo reviews gallery

### 8.7 Phase 6 Deliverables Summary

| Area | Count |
|------|-------|
| New component files | ~18 |
| New utility hooks | 3 |
| Enhanced components | 4 |
| New UI patterns implemented | ~15 |

---

## 9. Design System Consistency Checklist

Every new component and route **must** pass this checklist before merge:

### 9.1 Type Safety
- [ ] Type definition exists in `packages/cityos-design-system/src/<domain>/<Domain>Types.ts`
- [ ] Props interface extends `BaseComponentProps` (from `packages/cityos-design-system/src/components/ComponentTypes.ts`)
- [ ] Type is exported from `packages/cityos-design-system/src/index.ts`
- [ ] No `any` types — use proper generics or union types

### 9.2 Styling
- [ ] All colors use `ds-*` token classes (e.g., `bg-ds-primary`, `text-ds-foreground`, `border-ds-border`)
- [ ] No hardcoded hex/rgb/hsl values
- [ ] Spacing uses Tailwind spacing scale (consistent with `packages/cityos-design-tokens/src/spacing/SpacingTokens.ts`)
- [ ] Shadows use `ds-shadow-*` or elevation tokens
- [ ] Transitions use motion tokens (`duration-normal`, `ease-default`)

### 9.3 RTL/LTR Support
- [ ] All margin/padding uses logical properties: `ms-`/`me-`/`ps-`/`pe-` (never `ml-`/`mr-`/`pl-`/`pr-`)
- [ ] All positioning uses `start-`/`end-` (never `left-`/`right-`)
- [ ] All text alignment uses `text-start`/`text-end` (never `text-left`/`text-right`)
- [ ] Flex layouts properly reverse in RTL via `flex-row` + rtl.css
- [ ] Border radius uses `rounded-s-`/`rounded-e-` for directional rounding

### 9.4 Internationalization
- [ ] All user-facing strings use `t(locale, "namespace.key")` pattern
- [ ] Keys added to `apps/storefront/src/lib/i18n/locales/en.json`
- [ ] Keys added to `apps/storefront/src/lib/i18n/locales/fr.json`
- [ ] Keys added to `apps/storefront/src/lib/i18n/locales/ar.json`
- [ ] Date/time formatting uses `Intl.DateTimeFormat` with locale parameter
- [ ] Number/currency formatting uses `Intl.NumberFormat` with locale parameter

### 9.5 SSR Safety
- [ ] No `window`, `document`, `localStorage` access outside `useEffect` or event handlers
- [ ] Route loaders return minimal data (no heavy queries)
- [ ] Client-side data fetching via React Query hooks
- [ ] Dynamic imports for heavy client-only libraries (maps, charts, etc.)
- [ ] No `typeof window !== 'undefined'` checks — use `useEffect` instead

### 9.6 Responsive Design
- [ ] Mobile-first approach: base styles for mobile, `md:` for tablet, `lg:` for desktop
- [ ] Section padding follows pattern: `py-12 md:py-16 lg:py-20`
- [ ] Container uses `content-container` class or `px-4 md:px-6`
- [ ] Typography scales responsively: `text-2xl md:text-3xl lg:text-4xl`
- [ ] Grid columns adapt: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 9.7 Accessibility
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] Screen reader announcements for dynamic content
- [ ] `role` attributes on custom widgets

### 9.8 Data Fetching
- [ ] React Query used for all server data
- [ ] Query keys follow convention: `["domain", id?, filters?]`
- [ ] Loading states use `SkeletonProps` from design system
- [ ] Error states use `EmptyStateProps` with retry action
- [ ] Mutations use `useMutation` with proper invalidation

### 9.9 Error Handling
- [ ] Error boundaries wrap route components
- [ ] API errors surface user-friendly messages via `t()` function
- [ ] Loading skeletons match layout (not just spinner)
- [ ] Empty states have clear CTAs

---

## 10. Backend Implementation Pattern

### 10.1 Standard Module Structure

For each new backend module (e.g., `wallet`, `dispute`, `tbyb`, `consignment`):

```
apps/backend/src/modules/<module-name>/
├── models/
│   ├── <entity>.ts           # MikroORM entity definition
│   └── index.ts              # barrel export
├── service.ts                # extends MedusaService
├── index.ts                  # module registration
└── migrations/
    └── Migration<timestamp>.ts
```

### 10.2 Entity Pattern

Following the existing pattern from `apps/backend/src/modules/auction/models/auction-listing.ts`:

```typescript
import { model } from "@medusajs/framework/utils"

const WalletTransaction = model.define("wallet_transaction", {
  id: model.id().primaryKey(),
  tenant_id: model.text(),
  wallet_id: model.text(),
  type: model.enum(["credit", "debit", "transfer", "refund", "top-up"]),
  amount: model.bigNumber(),
  currency_code: model.text(),
  description: model.text(),
  reference: model.text().nullable(),
  status: model.enum(["completed", "pending", "failed"]).default("pending"),
  metadata: model.json().nullable(),
})

export default WalletTransaction
```

### 10.3 API Route Pattern

Following the existing pattern from `apps/backend/src/api/store/auctions/route.ts`:

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("wallet") as any
  const { limit = "20", offset = "0", tenant_id } = req.query as Record<string, string | undefined>
  const filters: Record<string, any> = {}
  if (tenant_id) filters.tenant_id = tenant_id

  const items = await mod.listWalletTransactions(filters, {
    skip: Number(offset),
    take: Number(limit),
  })

  return res.json({
    items,
    count: Array.isArray(items) ? items.length : 0,
    limit: Number(limit),
    offset: Number(offset),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("wallet") as any
  const data = req.body as Record<string, unknown>

  const result = await mod.createWalletTransaction(data)
  return res.status(201).json({ item: result })
}
```

### 10.4 Temporal Workflow Integration Pattern

```typescript
// In API route or subscriber
import { Connection, Client } from "@temporalio/client"

async function triggerWorkflow(workflowType: string, input: unknown) {
  const connection = await Connection.connect({ address: process.env.TEMPORAL_ADDRESS })
  const client = new Client({ connection, namespace: process.env.TEMPORAL_NAMESPACE })

  const handle = await client.workflow.start(workflowType, {
    args: [input],
    taskQueue: "commerce-queue", // or appropriate queue
    workflowId: `${workflowType}-${Date.now()}`,
  })

  return handle.workflowId
}
```

### 10.5 Event Outbox Pattern

```typescript
// In subscriber
import { SubscriberArgs } from "@medusajs/framework"

export default async function handleEvent({ event, container }: SubscriberArgs) {
  const eventOutbox = container.resolve("eventOutbox")

  await eventOutbox.publish({
    event_type: event.name,
    payload: event.data,
    correlation_id: event.metadata?.correlation_id,
    causation_id: event.metadata?.causation_id,
    tenant_id: event.data.tenant_id,
  })
}
```

### 10.6 Migration Generation

```bash
npx medusa db:generate <module-name>
npx medusa db:migrate
```

---

## 11. Temporal Workflow Integration Map

### 11.1 Task Queue Mapping

| Task Queue | Features | Existing? |
|------------|----------|-----------|
| `commerce-queue` | Auctions, rentals, bookings, events, TBYB, consignment, subscriptions | Yes |
| `xsystem-platform-queue` | Cross-system sync, CMS sync, tenant provisioning | Yes |
| `xsystem-logistics-queue` | Delivery slots, tracking, returns, BOPIS, Fleetbase integration | Yes |
| `xsystem-payment-queue` | Wallet, BNPL, escrow, disputes, Stripe integration | Yes |
| `identity-queue` | KYC, age verification, Walt.id credential issuance | Yes |
| `content-queue` | Blog publishing, help center indexing | New |
| `campaign-queue` | Crowdfunding deadlines, flash sale timers, referral tracking | New |

### 11.2 New Workflows by Phase

#### Phase 1 Workflows
| Workflow | Queue | Trigger | Activities |
|----------|-------|---------|------------|
| `auction-bid-processing` | commerce-queue | Bid placed | Validate bid → Update current price → Notify outbid users → Check auto-extend |
| `auction-end-processing` | commerce-queue | Auction ends_at reached | Determine winner → Create escrow → Notify parties → Update listing status |
| `rental-agreement-lifecycle` | commerce-queue | Rental booked | Create agreement → Charge deposit → Schedule return reminders → Process return |
| `event-ticket-reservation` | commerce-queue | Ticket selected | Hold ticket (10 min) → Process payment → Confirm ticket → Send e-ticket |
| `membership-lifecycle` | commerce-queue | Membership signup | Activate membership → Schedule renewal → Process renewal payment → Send reminders |
| `campaign-funding-check` | campaign-queue | Campaign deadline | Check funding threshold → Process all pledges or refund → Trigger fulfillment |
| `loyalty-points-earning` | commerce-queue | Order completed | Calculate points → Credit ledger → Check tier upgrade → Notify customer |

#### Phase 2 Workflows
| Workflow | Queue | Trigger | Activities |
|----------|-------|---------|------------|
| `delivery-slot-reservation` | xsystem-logistics-queue | Slot selected | Hold slot → Confirm on payment → Assign driver via Fleetbase |
| `real-time-tracking-poll` | xsystem-logistics-queue | Order shipped | Poll Fleetbase location → Update ETA → Notify customer on status change |
| `return-processing` | xsystem-logistics-queue | Return requested | Generate label → Track return shipment → Inspect → Process refund/exchange |
| `bopis-preparation` | xsystem-logistics-queue | Pickup order placed | Notify store → Track preparation → Notify customer when ready |

#### Phase 3 Workflows
| Workflow | Queue | Trigger | Activities |
|----------|-------|---------|------------|
| `wallet-top-up` | xsystem-payment-queue | Top-up initiated | Process Stripe payment → Credit wallet → Record transaction |
| `bnpl-eligibility-check` | xsystem-payment-queue | Checkout initiated | Check provider eligibility → Return available plans → Create payment plan |
| `escrow-lifecycle` | xsystem-payment-queue | Purchase with escrow | Hold funds → Wait for confirmation → Release or dispute → Settlement |
| `dispute-resolution` | xsystem-payment-queue | Dispute filed | Create case → Collect evidence → Review → Resolve → Process refund if needed |

#### Phase 4 Workflows
| Workflow | Queue | Trigger | Activities |
|----------|-------|---------|------------|
| `tbyb-trial-lifecycle` | commerce-queue | Trial started | Start trial → Send reminders → Auto-charge or process return |
| `consignment-settlement` | commerce-queue | Consignment item sold | Calculate commission → Create payout → Notify consignor |

#### Phase 5 Workflows
| Workflow | Queue | Trigger | Activities |
|----------|-------|---------|------------|
| `kyc-verification` | identity-queue | KYC submitted | Validate documents → Call Walt.id → Issue credential → Update status |
| `content-publishing` | content-queue | Article published | Index for search → Send newsletter notification → Update sitemap |

---

## 12. Effort Estimates & Timeline

### 12.1 Summary Table

| Phase | Scope | New Files | New Routes | New Types | Est. Dev Days |
|-------|-------|-----------|------------|-----------|---------------|
| **Phase 0** | Design System Foundation | 13 | 0 | ~80 | **5** |
| **Phase 1** | Category A Storefronts | ~75 | 18 | 0 (from P0) | **25** |
| **Phase 2** | Logistics & Delivery UX | ~16 | 2 | 0 (from P0) | **15** |
| **Phase 3** | Payment & Financial | ~20 | 2 | 0 (from P0) | **18** |
| **Phase 4** | Missing Commerce Models | ~35 | 6 | 5 | **22** |
| **Phase 5** | Content & Identity | ~25 | 8 | 0 (from P0) | **15** |
| **Phase 6** | Advanced UI Patterns | ~21 | 0 | 3 | **18** |
| **Total** | | **~205** | **36** | **~88** | **118** |

### 12.2 Dependencies

```
Phase 0 (Foundation) ──┬──→ Phase 1 (Storefronts) ──→ Phase 4 (Missing Models)
                       ├──→ Phase 2 (Logistics)
                       ├──→ Phase 3 (Payments)
                       ├──→ Phase 5 (Content)
                       └──→ Phase 6 (UI Patterns)
```

- **Phase 0** is a hard dependency for all other phases
- Phases 1–6 can run in parallel after Phase 0
- Phase 4 benefits from Phase 1 patterns being established
- Phase 6 benefits from Phases 1–5 providing data hooks

### 12.3 Parallel Workstreams

| Workstream | Phases | Team Size |
|------------|--------|-----------|
| **Design System & Types** | Phase 0, then support all phases | 1 dev |
| **Commerce Storefronts** | Phase 1 → Phase 4 | 2 devs |
| **Infrastructure UX** | Phase 2 (Logistics) + Phase 3 (Payments) | 2 devs |
| **Content & Identity** | Phase 5 + Phase 6 | 1 dev |

### 12.4 Recommended Timeline

| Week | Activities |
|------|-----------|
| 1 | Phase 0: All type files, tokens, i18n namespaces |
| 2–3 | Phase 1 P0: Events, Memberships (critical) |
| 3–5 | Phase 1 P1: Auctions, Rentals, Digital Products, Campaigns, Flash Sales, Bundles, Gift Cards, Loyalty |
| 4–6 | Phase 2: Delivery slots, tracking, returns, BOPIS (parallel) |
| 5–8 | Phase 3: Wallet, BNPL, installments, escrow, disputes (parallel) |
| 6–8 | Phase 1 P2: Social, Affiliate, Identity (parallel) |
| 8–11 | Phase 4: TBYB, consignment, trade-in, referral |
| 9–11 | Phase 5: Blog, help center, consent (parallel) |
| 10–13 | Phase 6: Advanced UI patterns |

---

## 13. Risk Assessment

### 13.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Design token inconsistency** | High — visual fragmentation | Medium | Phase 0 establishes all tokens before any UI work; PR review checklist enforces ds-* usage |
| **SSR hydration mismatches** | Medium — runtime errors | Medium | Strict `useEffect` gating for all client-only code; no `typeof window` checks |
| **RTL layout bugs** | Medium — broken Arabic UI | High | Automated visual regression tests for RTL; logical property linter rule |
| **React Query cache conflicts** | Low — stale data | Low | Consistent query key naming convention; proper invalidation in mutations |
| **Map library bundle size** | Medium — slow load | Medium | Dynamic import for map components; lazy loading with `React.lazy` |
| **Real-time auction performance** | High — user experience | Medium | Polling with `refetchInterval` initially; WebSocket upgrade path documented |

### 13.2 Dependency Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Fleetbase API changes** | High — logistics features broken | Low | Temporal activities wrap all Fleetbase calls; retry + compensation patterns |
| **Stripe BNPL availability** | Medium — payment options limited | Low | Provider-agnostic BNPL interface; fallback to Tabby/Klarna |
| **Walt.id credential format** | Low — identity features | Low | Temporal activities abstract Walt.id; credential format validation |
| **Temporal Cloud outage** | High — cross-system integration down | Very Low | Saga compensation patterns; event outbox for eventual consistency |
| **CMS migration to Payload** | Medium — content features rework | Medium | All content types use CMS registry abstraction; type contracts isolate from backend |

### 13.3 Scope Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Feature creep in auction UI** | Medium — timeline slip | High | Strict MVP: list, detail, bid only; advanced features (auto-bid, live stream) in Phase 6 |
| **Over-engineering payment flows** | Medium — complexity | Medium | Start with Stripe-only; abstract provider interface for future providers |
| **Accessibility compliance gap** | High — legal risk | Medium | WCAG AA checklist in every PR; automated axe-core testing |
| **i18n translation volume** | Low — incomplete translations | High | English-first launch; translation keys documented for batch translation |

### 13.4 Mitigation Strategy Summary

1. **Phase 0 as gate**: No UI work begins until all types and tokens are reviewed and merged
2. **PR review checklist**: Every PR must pass the Design System Consistency Checklist (Section 9)
3. **Incremental delivery**: Each phase produces usable features; no big-bang release
4. **Temporal resilience**: All cross-system calls wrapped in Temporal activities with retry policies
5. **Visual regression**: Screenshot tests for RTL and responsive layouts
6. **Performance budget**: Bundle size monitoring; lazy loading for heavy components (maps, charts, seat maps)

---

## Appendix A: File Creation Index

### New Directories

```
packages/cityos-design-system/src/auction/
packages/cityos-design-system/src/rental/
packages/cityos-design-system/src/events/
packages/cityos-design-system/src/delivery/
packages/cityos-design-system/src/payment/
packages/cityos-design-system/src/membership/
packages/cityos-design-system/src/digital/
packages/cityos-design-system/src/content/
packages/cityos-design-system/src/identity/
packages/cityos-design-system/src/social/
packages/cityos-design-system/src/campaign/
apps/storefront/src/components/auctions/
apps/storefront/src/components/rentals/
apps/storefront/src/components/events/
apps/storefront/src/components/delivery/
apps/storefront/src/components/digital/
apps/storefront/src/components/campaigns/
apps/storefront/src/components/memberships/
apps/storefront/src/components/flash-sales/
apps/storefront/src/components/bundles/
apps/storefront/src/components/social/
apps/storefront/src/components/payments/
apps/storefront/src/components/loyalty/
apps/storefront/src/components/gift-cards/
apps/storefront/src/components/affiliate/
apps/storefront/src/components/identity/
apps/storefront/src/components/consent/
apps/storefront/src/components/content/
apps/storefront/src/components/help/
apps/storefront/src/components/poi/
apps/storefront/src/components/referral/
apps/storefront/src/components/trade-in/
apps/backend/src/modules/wallet/
apps/backend/src/modules/dispute/
apps/backend/src/modules/tbyb/
apps/backend/src/modules/consignment/
```

### New Route Files

```
apps/storefront/src/routes/$tenant/$locale/auctions/index.tsx
apps/storefront/src/routes/$tenant/$locale/auctions/$auctionId.tsx
apps/storefront/src/routes/$tenant/$locale/rentals/index.tsx
apps/storefront/src/routes/$tenant/$locale/rentals/$rentalId.tsx
apps/storefront/src/routes/$tenant/$locale/events/index.tsx
apps/storefront/src/routes/$tenant/$locale/events/$eventId.tsx
apps/storefront/src/routes/$tenant/$locale/digital/index.tsx
apps/storefront/src/routes/$tenant/$locale/digital/$productId.tsx
apps/storefront/src/routes/$tenant/$locale/campaigns/index.tsx
apps/storefront/src/routes/$tenant/$locale/campaigns/$campaignId.tsx
apps/storefront/src/routes/$tenant/$locale/flash-sales/index.tsx
apps/storefront/src/routes/$tenant/$locale/bundles/index.tsx
apps/storefront/src/routes/$tenant/$locale/bundles/$bundleId.tsx
apps/storefront/src/routes/$tenant/$locale/gift-cards/index.tsx
apps/storefront/src/routes/$tenant/$locale/memberships/index.tsx
apps/storefront/src/routes/$tenant/$locale/social/index.tsx
apps/storefront/src/routes/$tenant/$locale/track/index.tsx
apps/storefront/src/routes/$tenant/$locale/returns/index.tsx
apps/storefront/src/routes/$tenant/$locale/verify/index.tsx
apps/storefront/src/routes/$tenant/$locale/refer/index.tsx
apps/storefront/src/routes/$tenant/$locale/blog/index.tsx
apps/storefront/src/routes/$tenant/$locale/blog/$slug.tsx
apps/storefront/src/routes/$tenant/$locale/help/index.tsx
apps/storefront/src/routes/$tenant/$locale/help/$categorySlug.tsx
apps/storefront/src/routes/$tenant/$locale/faq/index.tsx
apps/storefront/src/routes/$tenant/$locale/poi/index.tsx
apps/storefront/src/routes/$tenant/$locale/poi/$poiId.tsx
apps/storefront/src/routes/$tenant/$locale/about/index.tsx
apps/storefront/src/routes/$tenant/$locale/contact/index.tsx
apps/storefront/src/routes/$tenant/$locale/announcements/index.tsx
apps/storefront/src/routes/$tenant/$locale/compare/index.tsx
apps/storefront/src/routes/$tenant/$locale/explore/index.tsx
apps/storefront/src/routes/$tenant/$locale/promotions/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/wallet/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/downloads/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/rentals/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/memberships/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/loyalty/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/gift-cards/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/affiliate/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/trials/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/consignment/index.tsx
apps/storefront/src/routes/$tenant/$locale/account/orders/$orderId.dispute.tsx
apps/storefront/src/routes/$tenant/$locale/trade-in/index.tsx
apps/storefront/src/routes/$tenant/$locale/consignment/index.tsx
```

---

*This implementation plan is a living document. Update it as phases complete and requirements evolve.*
