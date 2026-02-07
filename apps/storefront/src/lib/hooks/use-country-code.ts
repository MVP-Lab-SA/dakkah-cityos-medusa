import { useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { listRegions } from "@/lib/data/regions"

// Default fallback - should match a configured region
const DEFAULT_COUNTRY = "us"

/**
 * Hook to get the current country code from route params
 * Falls back to the first available region's country, then to DEFAULT_COUNTRY
 */
export function useCountryCode(): string {
  const { data: regions } = useQuery({
    queryKey: ["regions"],
    queryFn: () => listRegions({ fields: "id, *countries" }),
    staleTime: Infinity,
  })

  try {
    const params = useParams({ strict: false }) as { countryCode?: string }
    if (params?.countryCode) {
      return params.countryCode
    }
  } catch {
    // Not in a route context, fall through to default
  }

  // Get first available country from regions
  if (regions?.length) {
    const firstCountry = regions[0]?.countries?.[0]?.iso_2
    if (firstCountry) {
      return firstCountry.toLowerCase()
    }
  }

  return DEFAULT_COUNTRY
}

/**
 * Get country code from window location as fallback
 * Used in non-hook contexts where useCountryCode can't be used
 */
export function getCountryCodeFromPath(): string {
  if (typeof window === "undefined") return DEFAULT_COUNTRY
  
  const path = window.location.pathname
  const match = path.match(/^\/([a-z]{2})\//i)
  return match?.[1]?.toLowerCase() || DEFAULT_COUNTRY
}

/**
 * Static function to get default country
 * Used when neither hook nor path is available
 */
export function getDefaultCountry(): string {
  return DEFAULT_COUNTRY
}
