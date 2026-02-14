const VERTICAL_CONFIG: Record<string, { slug: string; label: string; icon: string; enabled: boolean }> = {
  marketplace: { slug: "marketplace", label: "Marketplace", icon: "store", enabled: true },
  grocery: { slug: "grocery", label: "Grocery", icon: "shopping_cart", enabled: true },
  automotive: { slug: "automotive", label: "Automotive", icon: "directions_car", enabled: true },
  real_estate: { slug: "real-estate", label: "Real Estate", icon: "home", enabled: true },
  healthcare: { slug: "healthcare", label: "Healthcare", icon: "local_hospital", enabled: true },
  education: { slug: "education", label: "Education", icon: "school", enabled: true },
  travel: { slug: "travel", label: "Travel", icon: "flight", enabled: true },
  fitness: { slug: "fitness", label: "Fitness", icon: "fitness_center", enabled: true },
  restaurant: { slug: "restaurant", label: "Restaurant", icon: "restaurant", enabled: true },
  events: { slug: "events", label: "Events", icon: "event", enabled: false },
}

export function getVerticalSlug(verticalKey: string): string | null {
  const config = VERTICAL_CONFIG[verticalKey]
  return config ? config.slug : null
}

export function isValidVertical(verticalKey: string): boolean {
  return verticalKey in VERTICAL_CONFIG
}

export function getVerticalConfig(verticalKey: string): { slug: string; label: string; icon: string; enabled: boolean } | null {
  return VERTICAL_CONFIG[verticalKey] || null
}

export function getEnabledVerticals(): string[] {
  return Object.entries(VERTICAL_CONFIG)
    .filter(([, config]) => config.enabled)
    .map(([key]) => key)
}

export function getVerticalLabel(verticalKey: string): string {
  const config = VERTICAL_CONFIG[verticalKey]
  return config ? config.label : verticalKey
}
