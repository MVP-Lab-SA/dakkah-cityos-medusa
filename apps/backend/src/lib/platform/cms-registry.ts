import { DEFAULT_TENANT_ID } from "./registry"

export interface CMSPageEntry {
  id: string
  title: string
  slug: string
  path: string
  template: "vertical-list" | "vertical-detail" | "landing" | "static" | "category" | "node-browser" | "custom"
  status: "published" | "draft"
  tenant: string
  locale: string
  seo?: { title?: string; description?: string }
  verticalConfig?: {
    verticalSlug: string
    medusaEndpoint: string
    cardLayout?: "grid" | "list"
    filterFields?: string[]
    sortFields?: string[]
  }
  layout?: any[]
  governanceTags?: string[]
}

export interface NavigationItem {
  id: string
  label: string
  url: string
  children?: NavigationItem[]
  order: number
}

export interface NavigationEntry {
  id: string
  name: string
  slug: string
  tenant: string
  location: "header" | "footer" | "sidebar" | "mobile"
  locale: string
  status: "active" | "inactive"
  items: NavigationItem[]
}

interface VerticalDefinition {
  slug: string
  title: string
  endpoint: string
  seoDescription: string
  filterFields: string[]
  sortFields: string[]
  cardLayout: "grid" | "list"
  category: "commerce" | "services" | "lifestyle" | "community"
}

const VERTICALS: VerticalDefinition[] = [
  {
    slug: "restaurants",
    title: "Restaurants & Dining",
    endpoint: "/store/restaurants",
    seoDescription: "Discover local restaurants, cafés, and dining experiences. Browse menus, read reviews, and find the perfect place to eat near you.",
    filterFields: ["cuisine", "price_range", "rating", "location"],
    sortFields: ["name", "rating", "price_range", "created_at"],
    cardLayout: "grid",
    category: "commerce",
  },
  {
    slug: "healthcare",
    title: "Healthcare Practitioners & Clinics",
    endpoint: "/store/healthcare",
    seoDescription: "Find trusted healthcare practitioners, clinics, and medical services. Book appointments with doctors, dentists, and specialists.",
    filterFields: ["specialty", "location", "insurance", "rating"],
    sortFields: ["name", "rating", "distance", "created_at"],
    cardLayout: "list",
    category: "services",
  },
  {
    slug: "education",
    title: "Online Courses & Training",
    endpoint: "/store/education",
    seoDescription: "Explore online courses, professional training programs, and educational content. Learn new skills from expert instructors.",
    filterFields: ["subject", "level", "duration", "price"],
    sortFields: ["name", "price", "rating", "created_at"],
    cardLayout: "grid",
    category: "services",
  },
  {
    slug: "real-estate",
    title: "Property Listings",
    endpoint: "/store/real-estate",
    seoDescription: "Browse property listings for sale and rent. Find homes, apartments, commercial spaces, and land in your area.",
    filterFields: ["property_type", "price_range", "bedrooms", "location"],
    sortFields: ["price", "area", "bedrooms", "created_at"],
    cardLayout: "grid",
    category: "commerce",
  },
  {
    slug: "automotive",
    title: "Vehicle Marketplace",
    endpoint: "/store/automotive",
    seoDescription: "Shop new and used vehicles in our automotive marketplace. Compare cars, trucks, and motorcycles from trusted dealers.",
    filterFields: ["make", "model", "year", "price_range", "mileage"],
    sortFields: ["price", "year", "mileage", "created_at"],
    cardLayout: "grid",
    category: "commerce",
  },
  {
    slug: "grocery",
    title: "Grocery & Food Products",
    endpoint: "/store/grocery",
    seoDescription: "Order fresh groceries, pantry staples, and specialty food products online. Fast delivery from local stores and markets.",
    filterFields: ["category", "brand", "dietary", "price_range"],
    sortFields: ["name", "price", "popularity", "created_at"],
    cardLayout: "grid",
    category: "commerce",
  },
  {
    slug: "events",
    title: "Event Ticketing",
    endpoint: "/store/events",
    seoDescription: "Discover and book tickets for concerts, festivals, conferences, and local events. Never miss an experience near you.",
    filterFields: ["event_type", "date", "location", "price_range"],
    sortFields: ["date", "price", "popularity", "created_at"],
    cardLayout: "grid",
    category: "lifestyle",
  },
  {
    slug: "fitness",
    title: "Fitness Classes & Gyms",
    endpoint: "/store/fitness",
    seoDescription: "Find fitness classes, gym memberships, and personal trainers. Stay active with yoga, crossfit, swimming, and more.",
    filterFields: ["activity_type", "location", "schedule", "price_range"],
    sortFields: ["name", "rating", "price", "created_at"],
    cardLayout: "grid",
    category: "lifestyle",
  },
  {
    slug: "travel",
    title: "Travel & Accommodation",
    endpoint: "/store/travel",
    seoDescription: "Plan your next trip with travel packages, hotel bookings, and accommodation options. Explore destinations worldwide.",
    filterFields: ["destination", "travel_type", "date_range", "price_range"],
    sortFields: ["price", "rating", "destination", "created_at"],
    cardLayout: "grid",
    category: "lifestyle",
  },
  {
    slug: "charity",
    title: "Charity Campaigns & Donations",
    endpoint: "/store/charity",
    seoDescription: "Support meaningful causes and charity campaigns. Make donations to verified organizations making a difference in communities.",
    filterFields: ["cause", "organization", "goal_amount", "status"],
    sortFields: ["name", "goal_amount", "progress", "created_at"],
    cardLayout: "grid",
    category: "community",
  },
  {
    slug: "classifieds",
    title: "Classified Ads",
    endpoint: "/store/classifieds",
    seoDescription: "Post and browse classified ads for items, services, jobs, and more. Your local marketplace for buying, selling, and trading.",
    filterFields: ["category", "condition", "price_range", "location"],
    sortFields: ["price", "date_posted", "relevance", "created_at"],
    cardLayout: "list",
    category: "community",
  },
  {
    slug: "crowdfunding",
    title: "Crowdfunding Campaigns",
    endpoint: "/store/crowdfunding",
    seoDescription: "Launch or back crowdfunding campaigns for innovative projects, creative works, and community initiatives.",
    filterFields: ["category", "funding_goal", "status", "end_date"],
    sortFields: ["funding_goal", "progress", "end_date", "created_at"],
    cardLayout: "grid",
    category: "community",
  },
  {
    slug: "digital-products",
    title: "Digital Goods & Downloads",
    endpoint: "/store/digital-products",
    seoDescription: "Browse and purchase digital products including software, ebooks, templates, music, and creative assets for instant download.",
    filterFields: ["category", "format", "price_range", "rating"],
    sortFields: ["name", "price", "downloads", "created_at"],
    cardLayout: "grid",
    category: "commerce",
  },
  {
    slug: "financial-products",
    title: "Financial Services",
    endpoint: "/store/financial-products",
    seoDescription: "Explore financial products and services including insurance, loans, investment plans, and banking solutions.",
    filterFields: ["product_type", "provider", "interest_rate", "term"],
    sortFields: ["name", "interest_rate", "term", "created_at"],
    cardLayout: "list",
    category: "services",
  },
  {
    slug: "government",
    title: "Government Services",
    endpoint: "/store/government",
    seoDescription: "Access government services, permits, licenses, and public resources. Streamlined digital services for citizens and businesses.",
    filterFields: ["service_type", "department", "status", "processing_time"],
    sortFields: ["name", "processing_time", "popularity", "created_at"],
    cardLayout: "list",
    category: "services",
  },
  {
    slug: "memberships",
    title: "Membership Plans",
    endpoint: "/store/memberships",
    seoDescription: "Join exclusive membership plans and subscription programs. Access premium benefits, discounts, and member-only content.",
    filterFields: ["plan_type", "price_range", "duration", "tier"],
    sortFields: ["name", "price", "popularity", "created_at"],
    cardLayout: "grid",
    category: "services",
  },
  {
    slug: "parking",
    title: "Parking Zones & Bookings",
    endpoint: "/store/parking",
    seoDescription: "Find and reserve parking spaces in your city. Compare rates, check availability, and book parking spots in advance.",
    filterFields: ["zone", "parking_type", "price_range", "availability"],
    sortFields: ["price", "distance", "availability", "created_at"],
    cardLayout: "grid",
    category: "services",
  },
  {
    slug: "pet-services",
    title: "Pet Care Services",
    endpoint: "/store/pet-services",
    seoDescription: "Find trusted pet care services including grooming, boarding, veterinary care, training, and pet sitting near you.",
    filterFields: ["service_type", "pet_type", "location", "price_range"],
    sortFields: ["name", "rating", "price", "created_at"],
    cardLayout: "grid",
    category: "lifestyle",
  },
  {
    slug: "social-commerce",
    title: "Social Commerce Streams",
    endpoint: "/store/social-commerce",
    seoDescription: "Shop through live streams, social feeds, and community-driven commerce. Discover trending products from creators and influencers.",
    filterFields: ["category", "stream_type", "creator", "status"],
    sortFields: ["popularity", "viewers", "price", "created_at"],
    cardLayout: "grid",
    category: "community",
  },
  {
    slug: "utilities",
    title: "Utility Services",
    endpoint: "/store/utilities",
    seoDescription: "Manage utility services including electricity, water, internet, and telecommunications. Compare providers and plans.",
    filterFields: ["utility_type", "provider", "plan_type", "price_range"],
    sortFields: ["name", "price", "provider", "created_at"],
    cardLayout: "list",
    category: "services",
  },
  {
    slug: "warranties",
    title: "Warranty Plans",
    endpoint: "/store/warranties",
    seoDescription: "Protect your purchases with extended warranty plans and service contracts. Coverage options for electronics, appliances, and vehicles.",
    filterFields: ["product_type", "coverage_type", "duration", "price_range"],
    sortFields: ["name", "price", "coverage_duration", "created_at"],
    cardLayout: "list",
    category: "services",
  },
  {
    slug: "legal",
    title: "Legal Services",
    endpoint: "/store/legal",
    seoDescription: "Connect with qualified legal professionals for consultations, document preparation, and representation across practice areas.",
    filterFields: ["practice_area", "service_type", "location", "price_range"],
    sortFields: ["name", "rating", "price", "created_at"],
    cardLayout: "list",
    category: "services",
  },
  {
    slug: "freelance",
    title: "Freelance Marketplace",
    endpoint: "/store/freelance",
    seoDescription: "Hire skilled freelancers or offer your services. Find talent in design, development, writing, marketing, and more.",
    filterFields: ["skill_category", "experience_level", "hourly_rate", "rating"],
    sortFields: ["rating", "hourly_rate", "completed_jobs", "created_at"],
    cardLayout: "grid",
    category: "community",
  },
  {
    slug: "rentals",
    title: "Equipment & Property Rentals",
    endpoint: "/store/rentals",
    seoDescription: "Rent equipment, tools, vehicles, and properties. Flexible rental periods with competitive pricing for all your needs.",
    filterFields: ["rental_type", "category", "price_range", "availability"],
    sortFields: ["price", "rating", "availability", "created_at"],
    cardLayout: "grid",
    category: "commerce",
  },
  {
    slug: "auctions",
    title: "Auction Listings",
    endpoint: "/store/auctions",
    seoDescription: "Bid on unique items in our online auctions. Find collectibles, art, antiques, vehicles, and rare items from verified sellers.",
    filterFields: ["category", "current_bid", "end_time", "condition"],
    sortFields: ["current_bid", "end_time", "bids_count", "created_at"],
    cardLayout: "grid",
    category: "commerce",
  },
  {
    slug: "affiliates",
    title: "Affiliate Programs",
    endpoint: "/store/affiliates",
    seoDescription: "Join affiliate programs to earn commissions by promoting products and services. Track your referrals and earnings in one place.",
    filterFields: ["program_type", "commission_rate", "category", "status"],
    sortFields: ["commission_rate", "popularity", "name", "created_at"],
    cardLayout: "list",
    category: "community",
  },
  {
    slug: "advertising",
    title: "Advertising Services",
    endpoint: "/store/advertising",
    seoDescription: "Create and manage advertising campaigns across multiple channels. Reach your target audience with precision and measurable results.",
    filterFields: ["ad_type", "channel", "budget_range", "status"],
    sortFields: ["name", "budget", "impressions", "created_at"],
    cardLayout: "list",
    category: "services",
  },
]

function buildListPage(v: VerticalDefinition): CMSPageEntry {
  return {
    id: `local-cms-${v.slug}-list`,
    title: v.title,
    slug: v.slug,
    path: v.slug,
    template: "vertical-list",
    status: "published",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    seo: {
      title: `${v.title} | CityOS Marketplace`,
      description: v.seoDescription,
    },
    verticalConfig: {
      verticalSlug: v.slug,
      medusaEndpoint: v.endpoint,
      cardLayout: v.cardLayout,
      filterFields: v.filterFields,
      sortFields: v.sortFields,
    },
    layout: [],
    governanceTags: [],
  }
}

function buildDetailPage(v: VerticalDefinition): CMSPageEntry {
  return {
    id: `local-cms-${v.slug}-detail`,
    title: `${v.title} Detail`,
    slug: `${v.slug}/*`,
    path: `${v.slug}/*`,
    template: "vertical-detail",
    status: "published",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    seo: {
      title: `${v.title} | CityOS Marketplace`,
      description: `View detailed information, images, and reviews for this ${v.title.toLowerCase()} listing.`,
    },
    verticalConfig: {
      verticalSlug: v.slug,
      medusaEndpoint: v.endpoint,
      cardLayout: v.cardLayout,
      filterFields: v.filterFields,
      sortFields: v.sortFields,
    },
    layout: [],
    governanceTags: [],
  }
}

export const CMS_PAGE_REGISTRY: CMSPageEntry[] = VERTICALS.flatMap((v) => [
  buildListPage(v),
  buildDetailPage(v),
])

export function resolveLocalCMSPage(
  path: string,
  tenantId: string,
  locale?: string
): CMSPageEntry | null {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "")

  if (!normalizedPath) {
    return null
  }

  const exactMatch = CMS_PAGE_REGISTRY.find(
    (page) =>
      page.path === normalizedPath &&
      page.status === "published" &&
      page.tenant === tenantId &&
      (!locale || page.locale === locale || page.locale === "all")
  )

  if (exactMatch) {
    return exactMatch
  }

  const segments = normalizedPath.split("/")
  if (segments.length >= 2) {
    const parentSlug = segments[0]
    const itemSlug = segments.slice(1).join("/")

    const listPage = CMS_PAGE_REGISTRY.find(
      (page) =>
        page.path === parentSlug &&
        page.template === "vertical-list" &&
        page.status === "published" &&
        page.tenant === tenantId &&
        (!locale || page.locale === locale || page.locale === "all")
    )

    if (listPage) {
      const detailTemplate = CMS_PAGE_REGISTRY.find(
        (page) =>
          page.path === `${parentSlug}/*` &&
          page.template === "vertical-detail" &&
          page.status === "published" &&
          page.tenant === tenantId
      )

      if (detailTemplate) {
        return {
          ...detailTemplate,
          id: `${detailTemplate.id}-${itemSlug}`,
          slug: normalizedPath,
          path: normalizedPath,
          title: `${listPage.title} - ${formatItemSlug(itemSlug)}`,
          seo: {
            title: `${formatItemSlug(itemSlug)} | ${listPage.title} | CityOS Marketplace`,
            description: detailTemplate.seo?.description,
          },
        }
      }
    }
  }

  return null
}

function formatItemSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const HEADER_NAVIGATION: NavigationEntry = {
  id: "local-nav-header",
  name: "Main Navigation",
  slug: "main-navigation",
  tenant: DEFAULT_TENANT_ID,
  location: "header",
  locale: "en",
  status: "active",
  items: [
    {
      id: "nav-commerce",
      label: "Commerce",
      url: "#",
      order: 1,
      children: getVerticalsByCategory("commerce").map((v, i) => ({
        id: `nav-commerce-${v.slug}`,
        label: v.title,
        url: `/${v.slug}`,
        order: i + 1,
      })),
    },
    {
      id: "nav-services",
      label: "Services",
      url: "#",
      order: 2,
      children: getVerticalsByCategory("services").map((v, i) => ({
        id: `nav-services-${v.slug}`,
        label: v.title,
        url: `/${v.slug}`,
        order: i + 1,
      })),
    },
    {
      id: "nav-lifestyle",
      label: "Lifestyle",
      url: "#",
      order: 3,
      children: getVerticalsByCategory("lifestyle").map((v, i) => ({
        id: `nav-lifestyle-${v.slug}`,
        label: v.title,
        url: `/${v.slug}`,
        order: i + 1,
      })),
    },
    {
      id: "nav-community",
      label: "Community",
      url: "#",
      order: 4,
      children: getVerticalsByCategory("community").map((v, i) => ({
        id: `nav-community-${v.slug}`,
        label: v.title,
        url: `/${v.slug}`,
        order: i + 1,
      })),
    },
  ],
}

const FOOTER_NAVIGATION: NavigationEntry = {
  id: "local-nav-footer",
  name: "Footer Navigation",
  slug: "footer-navigation",
  tenant: DEFAULT_TENANT_ID,
  location: "footer",
  locale: "en",
  status: "active",
  items: VERTICALS.map((v, i) => ({
    id: `nav-footer-${v.slug}`,
    label: v.title,
    url: `/${v.slug}`,
    order: i + 1,
  })),
}

const NAVIGATION_REGISTRY: NavigationEntry[] = [
  HEADER_NAVIGATION,
  FOOTER_NAVIGATION,
]

export function getLocalCMSNavigation(
  tenantId: string,
  location: string
): NavigationEntry | null {
  return (
    NAVIGATION_REGISTRY.find(
      (nav) =>
        nav.tenant === tenantId &&
        nav.location === location &&
        nav.status === "active"
    ) || null
  )
}

function getVerticalsByCategory(category: VerticalDefinition["category"]): VerticalDefinition[] {
  return VERTICALS.filter((v) => v.category === category)
}
