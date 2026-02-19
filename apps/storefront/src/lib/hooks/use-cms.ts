import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/utils/query-keys"
import { fetchWithTimeout } from "@/lib/utils/env"

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

interface NavigationItem {
  id: string
  label: string
  url: string
  children?: NavigationItem[]
  order: number
}

interface NavigationEntry {
  id: string
  name: string
  slug: string
  tenant: string
  location: "header" | "footer" | "sidebar" | "mobile"
  locale: string
  items: NavigationItem[]
}

export function useCMSVerticals() {
  return useQuery<VerticalDefinition[]>({
    queryKey: queryKeys.cms.verticals("default"),
    queryFn: async () => {
      const response = await fetchWithTimeout(
        "/platform/cms/verticals?limit=50",
      )
      if (!response.ok) throw new Error("Failed to fetch verticals")
      const json = await response.json()
      return json.docs
    },
    enabled: typeof window !== "undefined",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCMSNavigation(
  location: "header" | "footer" | "sidebar" | "mobile",
) {
  return useQuery<NavigationEntry | null>({
    queryKey: queryKeys.cms.navigation("default", location),
    queryFn: async () => {
      const where = JSON.stringify({ location: { equals: location } })
      const response = await fetchWithTimeout(
        `/platform/cms/navigations?where=${encodeURIComponent(where)}&limit=1`,
      )
      if (!response.ok) throw new Error("Failed to fetch navigation")
      const json = await response.json()
      return json.docs?.[0] || null
    },
    enabled: typeof window !== "undefined",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
