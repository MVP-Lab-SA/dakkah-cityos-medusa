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

export type BlockType = BlockData["blockType"]

export type PageLayout = BlockData[]

export interface BlockRendererProps extends BaseComponentProps {
  blocks: PageLayout
  tenant?: string
  locale?: string
}
