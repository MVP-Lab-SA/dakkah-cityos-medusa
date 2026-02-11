export type ModuleScope = "platform" | "tenant" | "shared"
export type NavSection = "overview" | "commerce" | "marketplace" | "verticals" | "marketing" | "organization" | "platform" | "system"

export interface ModuleDefinition {
  key: string
  icon: string
  section: NavSection
  scope: ModuleScope
  minWeight: number
  path: string
}

export const NAV_SECTION_LABELS: Record<NavSection, string> = {
  overview: "Overview",
  commerce: "Commerce",
  marketplace: "Marketplace",
  verticals: "Verticals",
  marketing: "Marketing",
  organization: "Organization",
  platform: "Platform",
  system: "System",
}

export const NAV_SECTION_ORDER: NavSection[] = [
  "overview",
  "commerce",
  "marketplace",
  "verticals",
  "marketing",
  "organization",
  "platform",
  "system",
]

export const MODULE_REGISTRY: ModuleDefinition[] = [
  { key: "dashboard", icon: "SquaresPlus", section: "overview", scope: "tenant", minWeight: 40, path: "" },

  { key: "products", icon: "ShoppingBag", section: "commerce", scope: "tenant", minWeight: 40, path: "/products" },
  { key: "orders", icon: "DocumentText", section: "commerce", scope: "tenant", minWeight: 40, path: "/orders" },
  { key: "customers", icon: "Users", section: "commerce", scope: "tenant", minWeight: 40, path: "/customers" },
  { key: "quotes", icon: "Tag", section: "commerce", scope: "tenant", minWeight: 40, path: "/quotes" },
  { key: "invoices", icon: "Cash", section: "commerce", scope: "tenant", minWeight: 40, path: "/invoices" },
  { key: "subscriptions", icon: "ArrowPath", section: "commerce", scope: "tenant", minWeight: 40, path: "/subscriptions" },
  { key: "reviews", icon: "Star", section: "commerce", scope: "tenant", minWeight: 40, path: "/reviews" },

  { key: "vendors", icon: "BuildingStorefront", section: "marketplace", scope: "shared", minWeight: 70, path: "/vendors" },
  { key: "commissions", icon: "ArrowUpDown", section: "marketplace", scope: "shared", minWeight: 70, path: "/commissions" },
  { key: "payouts", icon: "Cash", section: "marketplace", scope: "shared", minWeight: 70, path: "/payouts" },
  { key: "affiliates", icon: "Sparkles", section: "marketplace", scope: "tenant", minWeight: 40, path: "/affiliates" },

  { key: "auctions", icon: "Bolt", section: "verticals", scope: "tenant", minWeight: 40, path: "/auctions" },
  { key: "bookings", icon: "Calendar", section: "verticals", scope: "tenant", minWeight: 40, path: "/bookings" },
  { key: "event-ticketing", icon: "Calendar", section: "verticals", scope: "tenant", minWeight: 40, path: "/event-ticketing" },
  { key: "rentals", icon: "TruckFast", section: "verticals", scope: "tenant", minWeight: 40, path: "/rentals" },
  { key: "restaurants", icon: "ChefHat", section: "verticals", scope: "tenant", minWeight: 40, path: "/restaurants" },
  { key: "grocery", icon: "ShoppingBag", section: "verticals", scope: "tenant", minWeight: 40, path: "/grocery" },
  { key: "travel", icon: "Sparkles", section: "verticals", scope: "tenant", minWeight: 40, path: "/travel" },
  { key: "automotive", icon: "TruckFast", section: "verticals", scope: "tenant", minWeight: 40, path: "/automotive" },
  { key: "real-estate", icon: "Buildings", section: "verticals", scope: "tenant", minWeight: 40, path: "/real-estate" },
  { key: "healthcare", icon: "Heart", section: "verticals", scope: "tenant", minWeight: 40, path: "/healthcare" },
  { key: "education", icon: "AcademicCap", section: "verticals", scope: "tenant", minWeight: 40, path: "/education" },
  { key: "fitness", icon: "Bolt", section: "verticals", scope: "tenant", minWeight: 40, path: "/fitness" },
  { key: "pet-services", icon: "Heart", section: "verticals", scope: "tenant", minWeight: 40, path: "/pet-services" },
  { key: "digital-products", icon: "RocketLaunch", section: "verticals", scope: "tenant", minWeight: 40, path: "/digital-products" },
  { key: "memberships", icon: "Bookmarks", section: "verticals", scope: "tenant", minWeight: 40, path: "/memberships" },
  { key: "financial-products", icon: "Cash", section: "verticals", scope: "tenant", minWeight: 40, path: "/financial-products" },
  { key: "freelance", icon: "RocketLaunch", section: "verticals", scope: "tenant", minWeight: 40, path: "/freelance" },
  { key: "parking", icon: "SquaresPlus", section: "verticals", scope: "tenant", minWeight: 40, path: "/parking" },
  { key: "utilities", icon: "Beaker", section: "verticals", scope: "tenant", minWeight: 40, path: "/utilities" },

  { key: "advertising", icon: "Target", section: "marketing", scope: "tenant", minWeight: 40, path: "/advertising" },
  { key: "promotions", icon: "Bolt", section: "marketing", scope: "tenant", minWeight: 40, path: "/promotions" },
  { key: "social-commerce", icon: "ChatBubble", section: "marketing", scope: "tenant", minWeight: 40, path: "/social-commerce" },
  { key: "classifieds", icon: "Tag", section: "marketing", scope: "tenant", minWeight: 40, path: "/classifieds" },
  { key: "crowdfunding", icon: "Trophy", section: "marketing", scope: "tenant", minWeight: 40, path: "/crowdfunding" },
  { key: "charity", icon: "Heart", section: "marketing", scope: "tenant", minWeight: 40, path: "/charity" },

  { key: "team", icon: "Users", section: "organization", scope: "tenant", minWeight: 40, path: "/team" },
  { key: "companies", icon: "Buildings", section: "organization", scope: "tenant", minWeight: 40, path: "/companies" },
  { key: "stores", icon: "BuildingStorefront", section: "organization", scope: "tenant", minWeight: 40, path: "/stores" },
  { key: "legal", icon: "Book", section: "organization", scope: "tenant", minWeight: 40, path: "/legal" },
  { key: "warranty", icon: "ShieldCheck", section: "organization", scope: "tenant", minWeight: 40, path: "/warranty" },

  { key: "governance", icon: "ShieldCheck", section: "platform", scope: "platform", minWeight: 90, path: "/governance" },
  { key: "nodes", icon: "ServerStack", section: "platform", scope: "platform", minWeight: 90, path: "/nodes" },
  { key: "region-zones", icon: "ServerStack", section: "platform", scope: "platform", minWeight: 90, path: "/region-zones" },
  { key: "personas", icon: "Users", section: "platform", scope: "platform", minWeight: 90, path: "/personas" },
  { key: "tenants", icon: "Buildings", section: "platform", scope: "platform", minWeight: 90, path: "/tenants" },
  { key: "channels", icon: "Channels", section: "platform", scope: "platform", minWeight: 90, path: "/channels" },

  { key: "analytics", icon: "ChartBar", section: "system", scope: "tenant", minWeight: 40, path: "/analytics" },
  { key: "settings", icon: "CogSixTooth", section: "system", scope: "tenant", minWeight: 40, path: "/settings" },
  { key: "i18n", icon: "Swatch", section: "system", scope: "shared", minWeight: 70, path: "/i18n" },
  { key: "audit", icon: "ShieldCheck", section: "system", scope: "platform", minWeight: 90, path: "/audit" },
]

export function getModulesBySection(maxWeight: number = 100): Record<NavSection, ModuleDefinition[]> {
  const grouped = {} as Record<NavSection, ModuleDefinition[]>
  for (const section of NAV_SECTION_ORDER) {
    grouped[section] = []
  }
  for (const mod of MODULE_REGISTRY) {
    if (mod.minWeight <= maxWeight) {
      grouped[mod.section].push(mod)
    }
  }
  return grouped
}
