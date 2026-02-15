import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/utils/query-keys"
import type { PlatformContextResponse } from "@/lib/types/cityos"
import { fetchWithTimeout } from "@/lib/utils/env"

export function usePlatformContext(tenantSlug: string) {
  return useQuery({
    queryKey: queryKeys.platform.context(tenantSlug),
    queryFn: async () => {
      const response = await fetchWithTimeout(`/platform/context?tenant=${tenantSlug}`)
      if (!response.ok) throw new Error("Platform context fetch failed")
      const json: PlatformContextResponse = await response.json()
      return json.data
    },
    enabled: !!tenantSlug && typeof window !== "undefined",
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useDefaultTenant() {
  return useQuery({
    queryKey: queryKeys.platform.defaultTenant(),
    queryFn: async () => {
      const response = await fetchWithTimeout(`/platform/tenants/default`)
      if (!response.ok) throw new Error("Default tenant fetch failed")
      const json = await response.json()
      return json.data
    },
    enabled: typeof window !== "undefined",
    staleTime: 5 * 60 * 1000,
  })
}

export function usePlatformCapabilities() {
  return useQuery({
    queryKey: queryKeys.platform.capabilities(),
    queryFn: async () => {
      const response = await fetchWithTimeout(`/platform/capabilities`)
      if (!response.ok) throw new Error("Capabilities fetch failed")
      const json = await response.json()
      return json.data
    },
    enabled: typeof window !== "undefined",
    staleTime: 10 * 60 * 1000,
  })
}
