import type { BaseComponentProps } from "../components/ComponentTypes"

export interface BlockBase {
  id?: string
  blockType: string
  blockName?: string
}

export interface HeroBlockData extends BlockBase {
  blockType: "hero"
  heading?: string
  subheading?: string
  backgroundImage?: MediaField
  backgroundVideo?: MediaField
  overlay?: "none" | "light" | "dark" | "gradient"
  alignment?: "start" | "center" | "end"
  minHeight?: "sm" | "md" | "lg" | "xl" | "full"
  cta?: CTAField[]
  badge?: string
}

export interface RichTextBlockData extends BlockBase {
  blockType: "richText"
  content: string
  columns?: 1 | 2
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full"
  textAlign?: "start" | "center" | "end"
}

export interface FeatureGridBlockData extends BlockBase {
  blockType: "featureGrid"
  heading?: string
  subtitle?: string
  features: FeatureItem[]
  columns?: 2 | 3 | 4
  variant?: "icon-top" | "icon-left" | "card" | "minimal"
}

export interface CTABlockData extends BlockBase {
  blockType: "cta"
  heading?: string
  description?: string
  buttons?: CTAField[]
  variant?: "banner" | "card" | "inline" | "split"
  backgroundStyle?: "primary" | "secondary" | "muted" | "accent" | "custom"
  backgroundImage?: MediaField
}

export interface ProductGridBlockData extends BlockBase {
  blockType: "productGrid"
  heading?: string
  description?: string
  source?: "latest" | "featured" | "category" | "vendor" | "manual"
  productIds?: string[]
  categoryId?: string
  vendorId?: string
  limit?: number
  columns?: 2 | 3 | 4
  showFilters?: boolean
  showSort?: boolean
  cardVariant?: "default" | "compact" | "detailed"
}

export interface CollectionListBlockData extends BlockBase {
  blockType: "collectionList"
  heading?: string
  description?: string
  collections?: { id: string; title: string; handle: string; image?: MediaField }[]
  layout?: "grid" | "carousel" | "list"
  columns?: 2 | 3 | 4 | 6
}

export interface TestimonialBlockData extends BlockBase {
  blockType: "testimonial"
  heading?: string
  testimonials: TestimonialItem[]
  layout?: "grid" | "carousel" | "stacked"
  columns?: 1 | 2 | 3
  showRating?: boolean
}

export interface FAQBlockData extends BlockBase {
  blockType: "faq"
  heading?: string
  description?: string
  items: FAQItem[]
  layout?: "accordion" | "two-column" | "categorized"
}

export interface PricingBlockData extends BlockBase {
  blockType: "pricing"
  heading?: string
  description?: string
  plans: PricingPlan[]
  billingToggle?: boolean
  highlightedPlan?: string
}

export interface StatsBlockData extends BlockBase {
  blockType: "stats"
  heading?: string
  stats: StatItem[]
  variant?: "default" | "card" | "inline" | "icon"
  columns?: 2 | 3 | 4
  animated?: boolean
}

export interface ImageGalleryBlockData extends BlockBase {
  blockType: "imageGallery"
  heading?: string
  images: GalleryImage[]
  layout?: "grid" | "masonry" | "carousel" | "lightbox"
  columns?: 2 | 3 | 4
  aspectRatio?: "square" | "landscape" | "portrait" | "auto"
}

export interface VideoEmbedBlockData extends BlockBase {
  blockType: "videoEmbed"
  heading?: string
  description?: string
  url: string
  provider?: "youtube" | "vimeo" | "custom"
  poster?: MediaField
  autoplay?: boolean
  aspectRatio?: "16:9" | "4:3" | "1:1"
}

export interface VendorShowcaseBlockData extends BlockBase {
  blockType: "vendorShowcase"
  heading?: string
  description?: string
  vendorIds?: string[]
  source?: "featured" | "top-rated" | "new" | "manual"
  limit?: number
  layout?: "grid" | "carousel" | "featured"
  showRating?: boolean
  showProducts?: boolean
}

export interface CategoryGridBlockData extends BlockBase {
  blockType: "categoryGrid"
  heading?: string
  description?: string
  categories?: CategoryItem[]
  columns?: 2 | 3 | 4 | 6
  variant?: "card" | "icon" | "image-overlay" | "minimal"
  showCount?: boolean
}

export interface ServiceListBlockData extends BlockBase {
  blockType: "serviceList"
  heading?: string
  description?: string
  services: ServiceItem[]
  layout?: "grid" | "list" | "carousel"
  columns?: 2 | 3 | 4
  showBooking?: boolean
  showPricing?: boolean
}

export interface EventListBlockData extends BlockBase {
  blockType: "eventList"
  heading?: string
  description?: string
  events: EventItem[]
  layout?: "timeline" | "grid" | "list" | "calendar"
  showPastEvents?: boolean
}

export interface BookingCTABlockData extends BlockBase {
  blockType: "bookingCTA"
  heading?: string
  description?: string
  serviceId?: string
  providerId?: string
  variant?: "inline" | "card" | "full-width"
  showAvailability?: boolean
  showPricing?: boolean
}

export interface MapBlockData extends BlockBase {
  blockType: "map"
  heading?: string
  locations: LocationItem[]
  zoom?: number
  height?: "sm" | "md" | "lg" | "xl"
  showList?: boolean
  interactive?: boolean
}

export interface ReviewListBlockData extends BlockBase {
  blockType: "reviewList"
  heading?: string
  entityType?: "product" | "vendor" | "service" | "booking"
  entityId?: string
  limit?: number
  showSummary?: boolean
  showForm?: boolean
  sortBy?: "recent" | "rating" | "helpful"
}

export interface PromotionBannerBlockData extends BlockBase {
  blockType: "promotionBanner"
  heading?: string
  description?: string
  code?: string
  expiresAt?: string
  image?: MediaField
  variant?: "banner" | "card" | "floating" | "countdown"
  dismissible?: boolean
}

export interface NewsletterBlockData extends BlockBase {
  blockType: "newsletter"
  heading?: string
  description?: string
  placeholder?: string
  buttonText?: string
  variant?: "inline" | "card" | "banner" | "minimal"
  backgroundStyle?: "primary" | "secondary" | "muted"
}

export interface TrustBadgesBlockData extends BlockBase {
  blockType: "trustBadges"
  heading?: string
  badges: TrustBadgeItem[]
  layout?: "row" | "grid"
  variant?: "icon" | "card" | "minimal"
}

export interface ComparisonTableBlockData extends BlockBase {
  blockType: "comparisonTable"
  heading?: string
  description?: string
  features: string[]
  items: ComparisonItem[]
  highlightedItem?: string
}

export interface TimelineBlockData extends BlockBase {
  blockType: "timeline"
  heading?: string
  steps: TimelineStep[]
  variant?: "vertical" | "horizontal" | "alternating"
  numbered?: boolean
}

export interface ContactFormBlockData extends BlockBase {
  blockType: "contactForm"
  heading?: string
  description?: string
  fields: FormFieldDef[]
  submitText?: string
  successMessage?: string
  recipientEmail?: string
}

export interface DividerBlockData extends BlockBase {
  blockType: "divider"
  style?: "line" | "dashed" | "dotted" | "gradient" | "space"
  spacing?: "sm" | "md" | "lg" | "xl"
}

export interface BannerCarouselBlockData extends BlockBase {
  blockType: "bannerCarousel"
  slides: BannerSlide[]
  autoplay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  height?: "sm" | "md" | "lg" | "xl" | "full"
}

export interface MediaField {
  url: string
  alt?: string
  width?: number
  height?: number
  mimeType?: string
}

export interface CTAField {
  text: string
  url: string
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link"
  icon?: string
  newTab?: boolean
}

export interface FeatureItem {
  icon?: string
  title: string
  description: string
  link?: string
}

export interface TestimonialItem {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: MediaField
  rating?: number
}

export interface FAQItem {
  question: string
  answer: string
  category?: string
}

export interface PricingPlan {
  id: string
  name: string
  description?: string
  price: { monthly?: number; yearly?: number; currency?: string }
  features: { text: string; included: boolean }[]
  cta?: CTAField
  popular?: boolean
  badge?: string
}

export interface StatItem {
  label: string
  value: string | number
  prefix?: string
  suffix?: string
  icon?: string
  change?: { value: number; direction: "up" | "down" }
}

export interface GalleryImage {
  image: MediaField
  caption?: string
  category?: string
}

export interface CategoryItem {
  id: string
  title: string
  slug: string
  description?: string
  image?: MediaField
  count?: number
  icon?: string
}

export interface ServiceItem {
  id: string
  title: string
  description?: string
  price?: { amount: number; currency?: string; unit?: string }
  duration?: string
  image?: MediaField
  rating?: number
  bookingUrl?: string
}

export interface EventItem {
  id: string
  title: string
  description?: string
  date: string
  endDate?: string
  location?: string
  image?: MediaField
  url?: string
  category?: string
  price?: { amount: number; currency?: string }
}

export interface LocationItem {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  phone?: string
  hours?: string
  image?: MediaField
}

export interface TrustBadgeItem {
  icon?: string
  title: string
  description?: string
  image?: MediaField
}

export interface ComparisonItem {
  id: string
  name: string
  image?: MediaField
  price?: { amount: number; currency?: string }
  values: Record<string, boolean | string>
  cta?: CTAField
}

export interface TimelineStep {
  title: string
  description?: string
  icon?: string
  date?: string
  status?: "completed" | "active" | "upcoming"
}

export interface FormFieldDef {
  name: string
  label: string
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "radio" | "number" | "date"
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
  width?: "full" | "half"
}

export interface BannerSlide {
  heading?: string
  subheading?: string
  image: MediaField
  overlay?: "none" | "light" | "dark" | "gradient"
  cta?: CTAField[]
  alignment?: "start" | "center" | "end"
}

export interface SubscriptionPlanItem {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  interval: "monthly" | "quarterly" | "yearly"
  features: string[]
  highlighted?: boolean
  cta?: CTAField
}

export interface MembershipTierItem {
  id: string
  name: string
  description?: string
  price?: number
  currency?: string
  benefits: string[]
  icon?: MediaField
  color?: string
  highlighted?: boolean
}

export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  currency?: string
  image?: MediaField
  dietary?: ("vegetarian" | "vegan" | "gluten_free" | "halal" | "kosher")[]
  popular?: boolean
  available?: boolean
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  items: MenuItem[]
  image?: MediaField
}

export interface ProductDetailBlockData extends BlockBase {
  blockType: "productDetail"
  productId?: string
  showReviews?: boolean
  showRelated?: boolean
  variant?: "default" | "compact" | "gallery"
}

export interface CartSummaryBlockData extends BlockBase {
  blockType: "cartSummary"
  variant?: "mini" | "full" | "sidebar"
  showCoupon?: boolean
  showEstimatedShipping?: boolean
}

export interface CheckoutStepsBlockData extends BlockBase {
  blockType: "checkoutSteps"
  steps?: string[]
  variant?: "horizontal" | "vertical"
  showOrderSummary?: boolean
}

export interface OrderConfirmationBlockData extends BlockBase {
  blockType: "orderConfirmation"
  showTracking?: boolean
  showRecommendations?: boolean
  thankYouMessage?: string
}

export interface WishlistGridBlockData extends BlockBase {
  blockType: "wishlistGrid"
  heading?: string
  columns?: 2 | 3 | 4
  showMoveToCart?: boolean
  emptyMessage?: string
}

export interface RecentlyViewedBlockData extends BlockBase {
  blockType: "recentlyViewed"
  heading?: string
  limit?: number
  layout?: "grid" | "carousel"
}

export interface FlashSaleCountdownBlockData extends BlockBase {
  blockType: "flashSaleCountdown"
  heading?: string
  endDate: string
  products?: string[]
  backgroundStyle?: "default" | "urgent" | "festive"
}

export interface GiftCardDisplayBlockData extends BlockBase {
  blockType: "giftCardDisplay"
  heading?: string
  denominations?: number[]
  allowCustomAmount?: boolean
  variant?: "card" | "inline"
}

export interface VendorProfileBlockData extends BlockBase {
  blockType: "vendorProfile"
  vendorId?: string
  showRating?: boolean
  showProducts?: boolean
  showStats?: boolean
  layout?: "full" | "compact" | "hero"
}

export interface VendorProductsBlockData extends BlockBase {
  blockType: "vendorProducts"
  vendorId?: string
  limit?: number
  showFilters?: boolean
  columns?: 2 | 3 | 4
  sortBy?: "newest" | "popular" | "price_asc" | "price_desc"
}

export interface VendorRegisterFormBlockData extends BlockBase {
  blockType: "vendorRegisterForm"
  heading?: string
  steps?: string[]
  requiredFields?: string[]
  termsUrl?: string
}

export interface CommissionDashboardBlockData extends BlockBase {
  blockType: "commissionDashboard"
  vendorId?: string
  period?: "daily" | "weekly" | "monthly" | "yearly"
  showChart?: boolean
}

export interface PayoutHistoryBlockData extends BlockBase {
  blockType: "payoutHistory"
  vendorId?: string
  limit?: number
  showFilters?: boolean
  columns?: ("date" | "amount" | "status" | "method")[]
}

export interface BookingCalendarBlockData extends BlockBase {
  blockType: "bookingCalendar"
  serviceId?: string
  variant?: "monthly" | "weekly" | "daily"
  showPricing?: boolean
  allowMultiDay?: boolean
}

export interface ServiceCardGridBlockData extends BlockBase {
  blockType: "serviceCardGrid"
  heading?: string
  services?: ServiceItem[]
  columns?: 2 | 3 | 4
  showBookingCta?: boolean
  categoryFilter?: string
}

export interface AppointmentSlotsBlockData extends BlockBase {
  blockType: "appointmentSlots"
  providerId?: string
  date?: string
  duration?: number
  variant?: "list" | "grid" | "timeline"
}

export interface BookingConfirmationBlockData extends BlockBase {
  blockType: "bookingConfirmation"
  showCalendarAdd?: boolean
  showCancellationPolicy?: boolean
  confirmationMessage?: string
}

export interface ProviderScheduleBlockData extends BlockBase {
  blockType: "providerSchedule"
  providerId?: string
  view?: "week" | "day" | "month"
  showAvailability?: boolean
}

export interface ResourceAvailabilityBlockData extends BlockBase {
  blockType: "resourceAvailability"
  resourceType?: string
  resourceId?: string
  dateRange?: { start: string; end: string }
  variant?: "calendar" | "list" | "timeline"
}

export interface SubscriptionPlansBlockData extends BlockBase {
  blockType: "subscriptionPlans"
  heading?: string
  plans?: SubscriptionPlanItem[]
  billingToggle?: boolean
  highlightedPlan?: string
  variant?: "cards" | "table" | "minimal"
}

export interface MembershipTiersBlockData extends BlockBase {
  blockType: "membershipTiers"
  heading?: string
  tiers?: MembershipTierItem[]
  showComparison?: boolean
  variant?: "cards" | "horizontal" | "vertical"
}

export interface LoyaltyDashboardBlockData extends BlockBase {
  blockType: "loyaltyDashboard"
  showTierProgress?: boolean
  showHistory?: boolean
  showRewards?: boolean
  variant?: "full" | "compact" | "widget"
}

export interface SubscriptionManageBlockData extends BlockBase {
  blockType: "subscriptionManage"
  subscriptionId?: string
  showUsage?: boolean
  allowPause?: boolean
  allowUpgrade?: boolean
}

export interface AuctionBiddingBlockData extends BlockBase {
  blockType: "auctionBidding"
  auctionId?: string
  showHistory?: boolean
  showCountdown?: boolean
  variant?: "full" | "compact" | "live"
}

export interface RentalCalendarBlockData extends BlockBase {
  blockType: "rentalCalendar"
  itemId?: string
  pricingUnit?: "hourly" | "daily" | "weekly" | "monthly"
  showDeposit?: boolean
  minDuration?: number
}

export interface PropertyListingBlockData extends BlockBase {
  blockType: "propertyListing"
  heading?: string
  propertyType?: "residential" | "commercial" | "land"
  layout?: "grid" | "list" | "map"
  filters?: string[]
  showMap?: boolean
}

export interface VehicleListingBlockData extends BlockBase {
  blockType: "vehicleListing"
  heading?: string
  vehicleType?: "car" | "truck" | "motorcycle" | "commercial"
  layout?: "grid" | "list" | "detailed"
  showComparison?: boolean
}

export interface MenuDisplayBlockData extends BlockBase {
  blockType: "menuDisplay"
  heading?: string
  categories?: MenuCategory[]
  variant?: "grid" | "list" | "visual"
  showPrices?: boolean
  showDietaryIcons?: boolean
  currency?: string
}

export interface CourseCurriculumBlockData extends BlockBase {
  blockType: "courseCurriculum"
  courseId?: string
  showProgress?: boolean
  expandAll?: boolean
  variant?: "tree" | "list" | "cards"
}

export interface EventScheduleBlockData extends BlockBase {
  blockType: "eventSchedule"
  eventId?: string
  view?: "timeline" | "grid" | "agenda"
  showSpeakers?: boolean
  allowBookmark?: boolean
  days?: string[]
}

export interface HealthcareProviderBlockData extends BlockBase {
  blockType: "healthcareProvider"
  heading?: string
  specialties?: string[]
  showAvailability?: boolean
  showRating?: boolean
  layout?: "grid" | "list" | "cards"
}

export interface FitnessClassScheduleBlockData extends BlockBase {
  blockType: "fitnessClassSchedule"
  heading?: string
  view?: "weekly" | "daily" | "list"
  showInstructor?: boolean
  showCapacity?: boolean
  filterByType?: string[]
}

export interface PetProfileCardBlockData extends BlockBase {
  blockType: "petProfileCard"
  heading?: string
  showServices?: boolean
  showVetInfo?: boolean
  variant?: "card" | "detailed" | "compact"
}

export interface ClassifiedAdCardBlockData extends BlockBase {
  blockType: "classifiedAdCard"
  heading?: string
  category?: string
  layout?: "grid" | "list" | "map"
  showContactInfo?: boolean
  showPrice?: boolean
}

export interface CrowdfundingProgressBlockData extends BlockBase {
  blockType: "crowdfundingProgress"
  campaignId?: string
  showBackers?: boolean
  showUpdates?: boolean
  variant?: "full" | "widget" | "minimal"
}

export interface DonationCampaignBlockData extends BlockBase {
  blockType: "donationCampaign"
  campaignId?: string
  showImpact?: boolean
  presetAmounts?: number[]
  allowRecurring?: boolean
  variant?: "full" | "compact" | "widget"
}

export interface FreelancerProfileBlockData extends BlockBase {
  blockType: "freelancerProfile"
  heading?: string
  showPortfolio?: boolean
  showReviews?: boolean
  showAvailability?: boolean
  layout?: "full" | "card" | "sidebar"
}

export interface ParkingSpotFinderBlockData extends BlockBase {
  blockType: "parkingSpotFinder"
  locationId?: string
  showMap?: boolean
  showPricing?: boolean
  filterByType?: ("covered" | "open" | "valet" | "ev_charging")[]
  variant?: "map" | "list" | "hybrid"
}

export interface PurchaseOrderFormBlockData extends BlockBase {
  blockType: "purchaseOrderForm"
  heading?: string
  requiresApproval?: boolean
  showBudget?: boolean
  defaultShipping?: string
}

export interface BulkPricingTableBlockData extends BlockBase {
  blockType: "bulkPricingTable"
  heading?: string
  productId?: string
  showSavings?: boolean
  highlightBestValue?: boolean
  variant?: "table" | "cards" | "steps"
}

export interface CompanyDashboardBlockData extends BlockBase {
  blockType: "companyDashboard"
  showSpend?: boolean
  showOrders?: boolean
  showTeam?: boolean
  showBudget?: boolean
  period?: "monthly" | "quarterly" | "yearly"
}

export interface ApprovalWorkflowBlockData extends BlockBase {
  blockType: "approvalWorkflow"
  showPending?: boolean
  showHistory?: boolean
  variant?: "list" | "kanban" | "timeline"
}

export interface BlogPostBlockData extends BlockBase {
  blockType: "blogPost"
  heading?: string
  content?: string
  author?: { name: string; avatar?: MediaField; bio?: string }
  publishedAt?: string
  category?: string
  tags?: string[]
  featuredImage?: MediaField
  readingTime?: number
}

export interface SocialProofBlockData extends BlockBase {
  blockType: "socialProof"
  heading?: string
  variant?: "popup" | "banner" | "ticker" | "inline"
  showPurchases?: boolean
  showReviews?: boolean
  maxItems?: number
  autoRotate?: boolean
}

export interface ReferralProgramBlockData extends BlockBase {
  blockType: "referralProgram"
  heading?: string
  description?: string
  rewardType?: "discount" | "credit" | "points" | "free_product"
  rewardValue?: number
  showLeaderboard?: boolean
  variant?: "full" | "card" | "widget"
}

export interface ManageStatsBlockData extends BlockBase {
  blockType: "manageStats"
  period?: "daily" | "weekly" | "monthly" | "yearly"
  modules?: string[]
}

export interface ManageRecentOrdersBlockData extends BlockBase {
  blockType: "manageRecentOrders"
  limit?: number
  showStatus?: boolean
}

export interface ManageActivityBlockData extends BlockBase {
  blockType: "manageActivity"
  limit?: number
  showTimestamps?: boolean
  filterByType?: string[]
}

export interface LoyaltyPointsDisplayBlockData extends BlockBase {
  blockType: "loyaltyPointsDisplay"
  variant?: "header" | "card" | "inline" | "widget"
  showHistory?: boolean
  showRedemption?: boolean
  showTier?: boolean
}

export type BlockData =
  | HeroBlockData
  | RichTextBlockData
  | FeatureGridBlockData
  | CTABlockData
  | ProductGridBlockData
  | CollectionListBlockData
  | TestimonialBlockData
  | FAQBlockData
  | PricingBlockData
  | StatsBlockData
  | ImageGalleryBlockData
  | VideoEmbedBlockData
  | VendorShowcaseBlockData
  | CategoryGridBlockData
  | ServiceListBlockData
  | EventListBlockData
  | BookingCTABlockData
  | MapBlockData
  | ReviewListBlockData
  | PromotionBannerBlockData
  | NewsletterBlockData
  | TrustBadgesBlockData
  | ComparisonTableBlockData
  | TimelineBlockData
  | ContactFormBlockData
  | DividerBlockData
  | BannerCarouselBlockData
  | ProductDetailBlockData
  | CartSummaryBlockData
  | CheckoutStepsBlockData
  | OrderConfirmationBlockData
  | WishlistGridBlockData
  | RecentlyViewedBlockData
  | FlashSaleCountdownBlockData
  | GiftCardDisplayBlockData
  | VendorProfileBlockData
  | VendorProductsBlockData
  | VendorRegisterFormBlockData
  | CommissionDashboardBlockData
  | PayoutHistoryBlockData
  | BookingCalendarBlockData
  | ServiceCardGridBlockData
  | AppointmentSlotsBlockData
  | BookingConfirmationBlockData
  | ProviderScheduleBlockData
  | ResourceAvailabilityBlockData
  | SubscriptionPlansBlockData
  | MembershipTiersBlockData
  | LoyaltyDashboardBlockData
  | SubscriptionManageBlockData
  | AuctionBiddingBlockData
  | RentalCalendarBlockData
  | PropertyListingBlockData
  | VehicleListingBlockData
  | MenuDisplayBlockData
  | CourseCurriculumBlockData
  | EventScheduleBlockData
  | HealthcareProviderBlockData
  | FitnessClassScheduleBlockData
  | PetProfileCardBlockData
  | ClassifiedAdCardBlockData
  | CrowdfundingProgressBlockData
  | DonationCampaignBlockData
  | FreelancerProfileBlockData
  | ParkingSpotFinderBlockData
  | PurchaseOrderFormBlockData
  | BulkPricingTableBlockData
  | CompanyDashboardBlockData
  | ApprovalWorkflowBlockData
  | BlogPostBlockData
  | SocialProofBlockData
  | ReferralProgramBlockData
  | LoyaltyPointsDisplayBlockData
  | ManageStatsBlockData
  | ManageRecentOrdersBlockData
  | ManageActivityBlockData

export type BlockType = BlockData["blockType"]

export type PageLayout = BlockData[]

export interface BlockRendererProps extends BaseComponentProps {
  blocks: PageLayout
  tenant?: string
  locale?: string
}
