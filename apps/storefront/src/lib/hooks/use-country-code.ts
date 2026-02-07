import { useParams } from "@tanstack/react-router"

/**
 * Hook to get the current country code from route params
 * Falls back to "us" if not available
 */
export function useCountryCode(): string {
  try {
    const params = useParams({ strict: false }) as { countryCode?: string }
    return params?.countryCode || "us"
  } catch {
    return "us"
  }
}

/**
 * Get country code from window location as fallback
 */
export function getCountryCodeFromPath(): string {
  if (typeof window === "undefined") return "us"
  
  const path = window.location.pathname
  const match = path.match(/^\/([a-z]{2})\//i)
  return match?.[1]?.toLowerCase() || "us"
}
