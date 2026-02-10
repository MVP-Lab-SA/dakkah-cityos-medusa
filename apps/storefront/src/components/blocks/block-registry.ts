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
}

export function getBlockComponent(blockType: string): React.ComponentType<any> | null {
  return BLOCK_REGISTRY[blockType] || null
}

export function getRegisteredBlockTypes(): string[] {
  return Object.keys(BLOCK_REGISTRY)
}
