import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { resolveLocalCMSPage } from "../../../../lib/platform/cms-registry"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { path, tenant, locale, tenant_id } = req.query as Record<string, string>

    if (!path) {
      return res.status(400).json({
        success: false,
        error: "Missing required query parameter: path",
      })
    }

    const resolvedTenantId = tenant_id || await resolveTenantId(req, tenant)

    const localPage = resolveLocalCMSPage(path, resolvedTenantId, locale)
    if (localPage) {
      res.setHeader("Cache-Control", "public, max-age=30, s-maxage=120")
      return res.status(200).json({
        success: true,
        data: {
          page: localPage,
          resolved: true,
          source: "local-registry",
          tenantId: resolvedTenantId,
          path,
          locale: locale || null,
        },
      })
    }

    const payloadUrl = process.env.PAYLOAD_CMS_URL || process.env.PAYLOAD_API_URL || "http://localhost:3001"

    const where: Record<string, any> = {
      path: { equals: path },
      status: { equals: "published" },
    }

    if (resolvedTenantId) {
      where.tenant = { equals: resolvedTenantId }
    }

    if (locale) {
      where.locale = { in: [locale, "all"] }
    }

    const query = new URLSearchParams({
      where: JSON.stringify(where),
      limit: "1",
      depth: "2",
    })

    try {
      const payloadApiKey = process.env.PAYLOAD_API_KEY || ""
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (payloadApiKey) {
        headers["Authorization"] = `Bearer ${payloadApiKey}`
      }

      const response = await fetch(`${payloadUrl}/api/pages?${query}`, { headers })

      if (!response.ok) {
        return res.status(200).json({
          success: true,
          data: { page: null, resolved: false, source: "payload", error: `Payload returned ${response.status}`, tenantId: resolvedTenantId, path },
        })
      }

      const data = await response.json()
      const page = data.docs?.[0] || null

      res.setHeader("Cache-Control", "public, max-age=30, s-maxage=120")

      return res.status(200).json({
        success: true,
        data: {
          page,
          resolved: !!page,
          source: "payload",
          tenantId: resolvedTenantId,
          path,
          locale: locale || null,
        },
      })
    } catch (fetchError) {
      return res.status(200).json({
        success: true,
        data: {
          page: null,
          resolved: false,
          source: "payload",
          error: "Payload CMS unavailable",
          tenantId: resolvedTenantId,
          path,
        },
      })
    }
  } catch (error) {
    console.error("[Platform:CMS:Resolve] Error:", error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    })
  }
}

async function resolveTenantId(req: MedusaRequest, tenantSlug?: string): Promise<string> {
  const DEFAULT_TENANT_ID = "01KGZ2JRYX607FWMMYQNQRKVWS"

  if (!tenantSlug || tenantSlug === "dakkah") {
    return DEFAULT_TENANT_ID
  }

  try {
    const tenantService = req.scope.resolve("tenantModuleService") as any
    if (tenantService?.listTenants) {
      const [tenants] = await tenantService.listTenants({ slug: tenantSlug })
      if (tenants?.length > 0) {
        return tenants[0].id
      }
    }
  } catch {
  }

  return DEFAULT_TENANT_ID
}
