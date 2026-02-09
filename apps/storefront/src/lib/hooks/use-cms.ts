import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/utils/query-keys"
import type { CMSPage, CMSNavigation, CMSVertical } from "@/lib/types/cityos"

async function fetchCMSPage(
  tenantId: string,
  path: string,
  locale?: string
): Promise<CMSPage | null> {
  try {
    const params = new URLSearchParams({
      path,
      tenant_id: tenantId,
    })
    if (locale) {
      params.set("locale", locale)
    }

    const baseUrl = typeof window === "undefined" ? "http://localhost:9000" : ""
    const response = await fetch(`${baseUrl}/platform/cms/resolve?${params}`)
    if (!response.ok) return null

    const data = await response.json()
    return data.data?.page || null
  } catch {
    return null
  }
}

async function fetchCMSPageChildren(
  tenantId: string,
  parentId: string
): Promise<CMSPage[]> {
  try {
    const payloadBaseUrl = typeof window === "undefined"
      ? (process.env.PAYLOAD_CMS_URL || "http://localhost:3001")
      : "/payload"

    const query = new URLSearchParams({
      where: JSON.stringify({
        parent: { equals: parentId },
        tenant: { equals: tenantId },
        status: { equals: "published" },
      }),
      sort: "sortOrder",
      limit: "100",
      depth: "1",
    })

    const response = await fetch(`${payloadBaseUrl}/api/pages?${query}`)
    if (!response.ok) return []

    const data = await response.json()
    return data.docs || []
  } catch {
    return []
  }
}

async function fetchCMSNavigation(
  tenantId: string,
  location: string,
  locale?: string
): Promise<CMSNavigation | null> {
  try {
    const params = new URLSearchParams({
      tenant_id: tenantId,
      location,
    })
    if (locale) {
      params.set("locale", locale)
    }

    const baseUrl = typeof window === "undefined" ? "http://localhost:9000" : ""
    const response = await fetch(`${baseUrl}/platform/cms/navigation?${params}`)
    if (!response.ok) return null

    const data = await response.json()
    return data.data?.navigations?.[0] || null
  } catch {
    return null
  }
}

async function fetchCMSVerticals(
  tenantId: string
): Promise<CMSVertical[]> {
  try {
    const payloadBaseUrl = typeof window === "undefined"
      ? (process.env.PAYLOAD_CMS_URL || "http://localhost:3001")
      : "/payload"

    const query = new URLSearchParams({
      where: JSON.stringify({
        tenant: { equals: tenantId },
        isEnabled: { equals: true },
        status: { equals: "active" },
      }),
      sort: "sortOrder",
      limit: "100",
    })

    const response = await fetch(`${payloadBaseUrl}/api/verticals?${query}`)
    if (!response.ok) return []

    const data = await response.json()
    return data.docs || []
  } catch {
    return []
  }
}

export function useCMSPage(tenantId: string | undefined, path: string, locale?: string) {
  return useQuery({
    queryKey: queryKeys.cms.pageByPath(tenantId || "", path, locale),
    queryFn: () => fetchCMSPage(tenantId!, path, locale),
    enabled: typeof window !== "undefined" && !!tenantId && !!path,
    staleTime: 60_000,
    retry: 1,
  })
}

export function useCMSPageChildren(tenantId: string | undefined, parentId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.cms.pageChildren(tenantId || "", parentId || ""),
    queryFn: () => fetchCMSPageChildren(tenantId!, parentId!),
    enabled: typeof window !== "undefined" && !!tenantId && !!parentId,
    staleTime: 60_000,
  })
}

export function useCMSNavigation(tenantId: string | undefined, location: string, locale?: string) {
  return useQuery({
    queryKey: queryKeys.cms.navigation(tenantId || "", location, locale),
    queryFn: () => fetchCMSNavigation(tenantId!, location, locale),
    enabled: typeof window !== "undefined" && !!tenantId,
    staleTime: 300_000,
  })
}

export function useCMSVerticals(tenantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.cms.verticals(tenantId || ""),
    queryFn: () => fetchCMSVerticals(tenantId!),
    enabled: typeof window !== "undefined" && !!tenantId,
    staleTime: 300_000,
  })
}

export { fetchCMSPage, fetchCMSPageChildren, fetchCMSNavigation, fetchCMSVerticals }
