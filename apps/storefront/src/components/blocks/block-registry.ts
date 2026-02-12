import type React from "react"

import { HeroBlock } from "./hero-block"
import { FeaturesBlock } from "./features-block"
import { ContentBlock } from "./content-block"
import { CTABlock } from "./cta-block"
import { ProductsBlock } from "./products-block"
import { TestimonialBlock } from "./testimonial-block"
import { FaqBlock } from "./faq-block"
import { PricingBlock } from "./pricing-block"
import { StatsBlock } from "./stats-block"
import { ImageGalleryBlock } from "./image-gallery-block"
import { DividerBlock } from "./divider-block"
import { VendorShowcaseBlock } from "./vendor-showcase-block"
import { CategoryGridBlock } from "./category-grid-block"
import { ServiceListBlock } from "./service-list-block"
import { NewsletterBlock } from "./newsletter-block"
import { TrustBadgesBlock } from "./trust-badges-block"
import { TimelineBlock } from "./timeline-block"
import { CollectionListBlock } from "./collection-list-block"
import { VideoEmbedBlock } from "./video-embed-block"
import { EventListBlock } from "./event-list-block"
import { BookingCtaBlock } from "./booking-cta-block"
import { PromotionBannerBlock } from "./promotion-banner-block"
import { ComparisonTableBlock } from "./comparison-table-block"
import { ContactFormBlock } from "./contact-form-block"
import { BannerCarouselBlock } from "./banner-carousel-block"
import { MapBlock } from "./map-block"
import { ReviewListBlock } from "./review-list-block"
import { ManageStatsBlock } from "./manage-stats-block"
import { ManageRecentOrdersBlock } from "./manage-recent-orders-block"
import { ManageActivityBlock } from "./manage-activity-block"

import { ProductDetailBlock } from "./product-detail-block"
import { CartSummaryBlock } from "./cart-summary-block"
import { CheckoutStepsBlock } from "./checkout-steps-block"
import { OrderConfirmationBlock } from "./order-confirmation-block"
import { WishlistGridBlock } from "./wishlist-grid-block"
import { RecentlyViewedBlock } from "./recently-viewed-block"
import { FlashSaleCountdownBlock } from "./flash-sale-countdown-block"
import { GiftCardDisplayBlock } from "./gift-card-display-block"

import { VendorProfileBlock } from "./vendor-profile-block"
import { VendorProductsBlock } from "./vendor-products-block"
import { VendorRegisterFormBlock } from "./vendor-register-form-block"
import { CommissionDashboardBlock } from "./commission-dashboard-block"
import { PayoutHistoryBlock } from "./payout-history-block"

import { BookingCalendarBlock } from "./booking-calendar-block"
import { ServiceCardGridBlock } from "./service-card-grid-block"
import { AppointmentSlotsBlock } from "./appointment-slots-block"
import { BookingConfirmationBlock } from "./booking-confirmation-block"
import { ProviderScheduleBlock } from "./provider-schedule-block"
import { ResourceAvailabilityBlock } from "./resource-availability-block"

import { SubscriptionPlansBlock } from "./subscription-plans-block"
import { MembershipTiersBlock } from "./membership-tiers-block"
import { LoyaltyDashboardBlock } from "./loyalty-dashboard-block"
import { SubscriptionManageBlock } from "./subscription-manage-block"

import { AuctionBiddingBlock } from "./auction-bidding-block"
import { RentalCalendarBlock } from "./rental-calendar-block"
import { PropertyListingBlock } from "./property-listing-block"
import { VehicleListingBlock } from "./vehicle-listing-block"
import { MenuDisplayBlock } from "./menu-display-block"
import { CourseCurriculumBlock } from "./course-curriculum-block"
import { EventScheduleBlock } from "./event-schedule-block"
import { HealthcareProviderBlock } from "./healthcare-provider-block"
import { FitnessClassScheduleBlock } from "./fitness-class-schedule-block"
import { PetProfileCardBlock } from "./pet-profile-card-block"
import { ClassifiedAdCardBlock } from "./classified-ad-card-block"
import { CrowdfundingProgressBlock } from "./crowdfunding-progress-block"
import { DonationCampaignBlock } from "./donation-campaign-block"
import { FreelancerProfileBlock } from "./freelancer-profile-block"
import { ParkingSpotFinderBlock } from "./parking-spot-finder-block"

import { PurchaseOrderFormBlock } from "./purchase-order-form-block"
import { BulkPricingTableBlock } from "./bulk-pricing-table-block"
import { CompanyDashboardBlock } from "./company-dashboard-block"
import { ApprovalWorkflowBlock } from "./approval-workflow-block"

import { BlogPostBlock } from "./blog-post-block"
import { SocialProofBlock } from "./social-proof-block"
import { ReferralProgramBlock } from "./referral-program-block"
import { LoyaltyPointsDisplayBlock } from "./loyalty-points-display-block"

export const BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  featureGrid: FeaturesBlock,
  richText: ContentBlock,
  cta: CTABlock,
  productGrid: ProductsBlock,
  testimonial: TestimonialBlock,
  faq: FaqBlock,
  pricing: PricingBlock,
  stats: StatsBlock,
  imageGallery: ImageGalleryBlock,
  divider: DividerBlock,
  vendorShowcase: VendorShowcaseBlock,
  categoryGrid: CategoryGridBlock,
  serviceList: ServiceListBlock,
  newsletter: NewsletterBlock,
  trustBadges: TrustBadgesBlock,
  timeline: TimelineBlock,
  collectionList: CollectionListBlock,
  videoEmbed: VideoEmbedBlock,
  eventList: EventListBlock,
  bookingCTA: BookingCtaBlock,
  promotionBanner: PromotionBannerBlock,
  comparisonTable: ComparisonTableBlock,
  contactForm: ContactFormBlock,
  bannerCarousel: BannerCarouselBlock,
  map: MapBlock,
  reviewList: ReviewListBlock,
  manageStats: ManageStatsBlock,
  manageRecentOrders: ManageRecentOrdersBlock,
  manageActivity: ManageActivityBlock,

  productDetail: ProductDetailBlock,
  cartSummary: CartSummaryBlock,
  checkoutSteps: CheckoutStepsBlock,
  orderConfirmation: OrderConfirmationBlock,
  wishlistGrid: WishlistGridBlock,
  recentlyViewed: RecentlyViewedBlock,
  flashSaleCountdown: FlashSaleCountdownBlock,
  giftCardDisplay: GiftCardDisplayBlock,

  vendorProfile: VendorProfileBlock,
  vendorProducts: VendorProductsBlock,
  vendorRegisterForm: VendorRegisterFormBlock,
  commissionDashboard: CommissionDashboardBlock,
  payoutHistory: PayoutHistoryBlock,

  bookingCalendar: BookingCalendarBlock,
  serviceCardGrid: ServiceCardGridBlock,
  appointmentSlots: AppointmentSlotsBlock,
  bookingConfirmation: BookingConfirmationBlock,
  providerSchedule: ProviderScheduleBlock,
  resourceAvailability: ResourceAvailabilityBlock,

  subscriptionPlans: SubscriptionPlansBlock,
  membershipTiers: MembershipTiersBlock,
  loyaltyDashboard: LoyaltyDashboardBlock,
  subscriptionManage: SubscriptionManageBlock,

  auctionBidding: AuctionBiddingBlock,
  rentalCalendar: RentalCalendarBlock,
  propertyListing: PropertyListingBlock,
  vehicleListing: VehicleListingBlock,
  menuDisplay: MenuDisplayBlock,
  courseCurriculum: CourseCurriculumBlock,
  eventSchedule: EventScheduleBlock,
  healthcareProvider: HealthcareProviderBlock,
  fitnessClassSchedule: FitnessClassScheduleBlock,
  petProfileCard: PetProfileCardBlock,
  classifiedAdCard: ClassifiedAdCardBlock,
  crowdfundingProgress: CrowdfundingProgressBlock,
  donationCampaign: DonationCampaignBlock,
  freelancerProfile: FreelancerProfileBlock,
  parkingSpotFinder: ParkingSpotFinderBlock,

  purchaseOrderForm: PurchaseOrderFormBlock,
  bulkPricingTable: BulkPricingTableBlock,
  companyDashboard: CompanyDashboardBlock,
  approvalWorkflow: ApprovalWorkflowBlock,

  blogPost: BlogPostBlock,
  socialProof: SocialProofBlock,
  referralProgram: ReferralProgramBlock,
  loyaltyPointsDisplay: LoyaltyPointsDisplayBlock,
}

export function getBlockComponent(blockType: string): React.ComponentType<any> | null {
  return BLOCK_REGISTRY[blockType] || null
}

export function getRegisteredBlockTypes(): string[] {
  return Object.keys(BLOCK_REGISTRY)
}
