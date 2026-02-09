import { DEFAULT_TENANT_ID } from "./registry"

type RegionZone = "GCC_EU" | "MENA" | "APAC" | "AMERICAS" | "GLOBAL"
type NodeLevel = "CITY" | "DISTRICT" | "ZONE" | "FACILITY" | "ASSET"

export interface PayloadPage {
  id: string
  createdAt: string
  updatedAt: string
  _status: "published" | "draft"
  title: string
  slug: string
  path: string
  template: "vertical-list" | "vertical-detail" | "landing" | "static" | "category" | "node-browser" | "custom"
  tenant: string
  locale: string
  countryCode: string
  regionZone: RegionZone
  nodeId?: string
  nodeLevel?: NodeLevel
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

export type CMSPageEntry = PayloadPage

export interface NavigationItem {
  id: string
  label: string
  url: string
  children?: NavigationItem[]
  order: number
}

export interface NavigationEntry {
  id: string
  createdAt: string
  updatedAt: string
  _status: "published" | "draft"
  name: string
  slug: string
  tenant: string
  location: "header" | "footer" | "sidebar" | "mobile"
  locale: string
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

export const VERTICAL_TEMPLATES: VerticalDefinition[] = VERTICALS

const REGISTRY_TIMESTAMP = "2026-02-09T00:00:00.000Z"

function buildListPage(v: VerticalDefinition): PayloadPage {
  return {
    id: `local-cms-${v.slug}-list`,
    createdAt: REGISTRY_TIMESTAMP,
    updatedAt: REGISTRY_TIMESTAMP,
    _status: "published",
    title: v.title,
    slug: v.slug,
    path: v.slug,
    template: "vertical-list",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    countryCode: "global",
    regionZone: "GLOBAL",
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

function buildDetailPage(v: VerticalDefinition): PayloadPage {
  return {
    id: `local-cms-${v.slug}-detail`,
    createdAt: REGISTRY_TIMESTAMP,
    updatedAt: REGISTRY_TIMESTAMP,
    _status: "published",
    title: `${v.title} Detail`,
    slug: `${v.slug}/*`,
    path: `${v.slug}/*`,
    template: "vertical-detail",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    countryCode: "global",
    regionZone: "GLOBAL",
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

const ADDITIONAL_PAGES: PayloadPage[] = [
  {
    id: "local-cms-home",
    createdAt: REGISTRY_TIMESTAMP,
    updatedAt: REGISTRY_TIMESTAMP,
    _status: "published",
    title: "Home",
    slug: "home",
    path: "",
    template: "landing",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    countryCode: "global",
    regionZone: "GLOBAL",
    seo: {
      title: "CityOS Marketplace",
      description: "Welcome to the CityOS Marketplace. Discover products, services, and experiences in your city.",
    },
    layout: [],
    governanceTags: [],
  },
  {
    id: "local-cms-store",
    createdAt: REGISTRY_TIMESTAMP,
    updatedAt: REGISTRY_TIMESTAMP,
    _status: "published",
    title: "Store",
    slug: "store",
    path: "store",
    template: "category",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    countryCode: "global",
    regionZone: "GLOBAL",
    seo: {
      title: "Store | CityOS Marketplace",
      description: "Browse all products and services available on the CityOS Marketplace.",
    },
    layout: [],
    governanceTags: [],
  },
  {
    id: "local-cms-search",
    createdAt: REGISTRY_TIMESTAMP,
    updatedAt: REGISTRY_TIMESTAMP,
    _status: "published",
    title: "Search",
    slug: "search",
    path: "search",
    template: "custom",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    countryCode: "global",
    regionZone: "GLOBAL",
    seo: {
      title: "Search | CityOS Marketplace",
      description: "Search across all verticals, products, and services on the CityOS Marketplace.",
    },
    layout: [],
    governanceTags: [],
  },
  {
    id: "local-cms-vendors",
    createdAt: REGISTRY_TIMESTAMP,
    updatedAt: REGISTRY_TIMESTAMP,
    _status: "published",
    title: "Vendors",
    slug: "vendors",
    path: "vendors",
    template: "vertical-list",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    countryCode: "global",
    regionZone: "GLOBAL",
    seo: {
      title: "Vendors | CityOS Marketplace",
      description: "Discover vendors and sellers on the CityOS Marketplace.",
    },
    layout: [],
    governanceTags: [],
  },
  {
    id: "local-cms-categories",
    createdAt: REGISTRY_TIMESTAMP,
    updatedAt: REGISTRY_TIMESTAMP,
    _status: "published",
    title: "Categories",
    slug: "categories",
    path: "categories",
    template: "category",
    tenant: DEFAULT_TENANT_ID,
    locale: "en",
    countryCode: "global",
    regionZone: "GLOBAL",
    seo: {
      title: "Categories | CityOS Marketplace",
      description: "Browse all categories available on the CityOS Marketplace.",
    },
    layout: [],
    governanceTags: [],
  },
]

export const CMS_PAGE_REGISTRY: PayloadPage[] = [
  ...ADDITIONAL_PAGES,
  ...VERTICALS.flatMap((v) => [buildListPage(v), buildDetailPage(v)]),
]

const COUNTRY_TO_REGION: Record<string, RegionZone> = {
  AE: "GCC_EU",
  SA: "GCC_EU",
  QA: "GCC_EU",
  KW: "GCC_EU",
  BH: "GCC_EU",
  OM: "GCC_EU",
  DE: "GCC_EU",
  FR: "GCC_EU",
  GB: "GCC_EU",
  IT: "GCC_EU",
  ES: "GCC_EU",
  EG: "MENA",
  JO: "MENA",
  LB: "MENA",
  MA: "MENA",
  TN: "MENA",
  IQ: "MENA",
  CN: "APAC",
  JP: "APAC",
  KR: "APAC",
  IN: "APAC",
  SG: "APAC",
  AU: "APAC",
  US: "AMERICAS",
  CA: "AMERICAS",
  MX: "AMERICAS",
  BR: "AMERICAS",
}

function resolveRegionZone(countryCode: string): RegionZone {
  if (countryCode === "global") return "GLOBAL"
  return COUNTRY_TO_REGION[countryCode.toUpperCase()] || "GLOBAL"
}

export function resolveLocalCMSPage(
  path: string,
  tenantId: string,
  locale?: string,
  countryCode?: string
): PayloadPage | null {
  const normalizedPath = path.replace(/^\/+|\/+$/g, "")

  const homePage = CMS_PAGE_REGISTRY.find(
    (p) =>
      p.path === "" &&
      p._status === "published" &&
      p.tenant === tenantId &&
      (!locale || p.locale === locale || p.locale === "all")
  )
  if (!normalizedPath && homePage) {
    return homePage
  }

  if (!normalizedPath) {
    return null
  }

  const matchLocale = (page: PayloadPage) =>
    !locale || page.locale === locale || page.locale === "all"

  const matchBase = (page: PayloadPage) =>
    page.path === normalizedPath &&
    page._status === "published" &&
    page.tenant === tenantId &&
    matchLocale(page)

  if (countryCode && countryCode !== "global") {
    const exactCountry = CMS_PAGE_REGISTRY.find(
      (page) => matchBase(page) && page.countryCode === countryCode
    )
    if (exactCountry) return exactCountry

    const region = resolveRegionZone(countryCode)
    if (region !== "GLOBAL") {
      const regionMatch = CMS_PAGE_REGISTRY.find(
        (page) =>
          matchBase(page) &&
          page.countryCode === "global" &&
          page.regionZone === region
      )
      if (regionMatch) return regionMatch
    }
  }

  const globalMatch = CMS_PAGE_REGISTRY.find(
    (page) => matchBase(page) && page.countryCode === "global"
  )
  if (globalMatch) return globalMatch

  const segments = normalizedPath.split("/")
  if (segments.length >= 2) {
    const parentSlug = segments[0]
    const itemSlug = segments.slice(1).join("/")

    const listPage = CMS_PAGE_REGISTRY.find(
      (page) =>
        page.path === parentSlug &&
        page.template === "vertical-list" &&
        page._status === "published" &&
        page.tenant === tenantId &&
        matchLocale(page)
    )

    if (listPage) {
      const detailTemplate = CMS_PAGE_REGISTRY.find(
        (page) =>
          page.path === `${parentSlug}/*` &&
          page.template === "vertical-detail" &&
          page._status === "published" &&
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

function matchWhereClause(page: PayloadPage, where: Record<string, any>): boolean {
  for (const [field, condition] of Object.entries(where)) {
    if (field === "and" && Array.isArray(condition)) {
      if (!condition.every((c: Record<string, any>) => matchWhereClause(page, c))) return false
      continue
    }
    if (field === "or" && Array.isArray(condition)) {
      if (!condition.some((c: Record<string, any>) => matchWhereClause(page, c))) return false
      continue
    }

    const value = (page as any)[field]

    if (typeof condition === "object" && condition !== null) {
      if ("equals" in condition && value !== condition.equals) return false
      if ("not_equals" in condition && value === condition.not_equals) return false
      if ("in" in condition && Array.isArray(condition.in) && !condition.in.includes(value)) return false
      if ("not_in" in condition && Array.isArray(condition.not_in) && condition.not_in.includes(value)) return false
      if ("like" in condition && typeof value === "string") {
        const pattern = String(condition.like).replace(/%/g, ".*")
        if (!new RegExp(`^${pattern}$`, "i").test(value)) return false
      }
      if ("contains" in condition && typeof value === "string") {
        if (!value.toLowerCase().includes(String(condition.contains).toLowerCase())) return false
      }
      if ("exists" in condition) {
        if (condition.exists && (value === undefined || value === null)) return false
        if (!condition.exists && value !== undefined && value !== null) return false
      }
    } else {
      if (value !== condition) return false
    }
  }
  return true
}

export function queryPages(params: {
  where?: Record<string, any>
  limit?: number
  sort?: string
  page?: number
}): {
  docs: PayloadPage[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
} {
  const { where, limit: rawLimit, sort, page: rawPage } = params
  const limit = rawLimit ?? 10
  const page = rawPage ?? 1

  let filtered = where
    ? CMS_PAGE_REGISTRY.filter((p) => matchWhereClause(p, where))
    : [...CMS_PAGE_REGISTRY]

  if (sort) {
    const desc = sort.startsWith("-")
    const field = desc ? sort.slice(1) : sort
    filtered.sort((a, b) => {
      const aVal = (a as any)[field]
      const bVal = (b as any)[field]
      if (aVal < bVal) return desc ? 1 : -1
      if (aVal > bVal) return desc ? -1 : 1
      return 0
    })
  }

  const totalDocs = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))
  const start = (page - 1) * limit
  const docs = filtered.slice(start, start + limit)

  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

const HEADER_NAVIGATION: NavigationEntry = {
  id: "local-nav-header",
  createdAt: REGISTRY_TIMESTAMP,
  updatedAt: REGISTRY_TIMESTAMP,
  _status: "published",
  name: "Main Navigation",
  slug: "main-navigation",
  tenant: DEFAULT_TENANT_ID,
  location: "header",
  locale: "en",
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
  createdAt: REGISTRY_TIMESTAMP,
  updatedAt: REGISTRY_TIMESTAMP,
  _status: "published",
  name: "Footer Navigation",
  slug: "footer-navigation",
  tenant: DEFAULT_TENANT_ID,
  location: "footer",
  locale: "en",
  items: VERTICALS.map((v, i) => ({
    id: `nav-footer-${v.slug}`,
    label: v.title,
    url: `/${v.slug}`,
    order: i + 1,
  })),
}

export const NAVIGATION_REGISTRY: NavigationEntry[] = [
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
        nav._status === "published"
    ) || null
  )
}

function getVerticalsByCategory(category: VerticalDefinition["category"]): VerticalDefinition[] {
  return VERTICALS.filter((v) => v.category === category)
}
