import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { tenant_id, location, locale } = req.query as Record<string, string>

    if (!tenant_id) {
      return res.status(400).json({
        success: false,
        error: "Missing required query parameter: tenant_id",
      })
    }

    const payloadUrl = process.env.PAYLOAD_CMS_URL || process.env.PAYLOAD_API_URL || "http://localhost:3001"

    const where: Record<string, any> = {
      tenant: { equals: tenant_id },
      status: { equals: "active" },
    }

    if (location) {
      where.location = { equals: location }
    }

    if (locale) {
      where.locale = { equals: locale }
    }

    const query = new URLSearchParams({
      where: JSON.stringify(where),
      limit: "10",
      depth: "3",
    })

    try {
      const payloadApiKey = process.env.PAYLOAD_API_KEY || ""
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (payloadApiKey) {
        headers["Authorization"] = `Bearer ${payloadApiKey}`
      }

      const response = await fetch(`${payloadUrl}/api/navigations?${query}`, { headers })

      if (!response.ok) {
        return res.status(200).json({
          success: true,
          data: { navigations: [], source: "payload" },
        })
      }

      const data = await response.json()

      res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300")

      return res.status(200).json({
        success: true,
        data: {
          navigations: data.docs || [],
          total: data.totalDocs || 0,
          source: "payload",
        },
      })
    } catch {
      return res.status(200).json({
        success: true,
        data: { navigations: [], source: "payload", error: "Payload CMS unavailable" },
      })
    }
  } catch (error) {
    console.error("[Platform:CMS:Navigation] Error:", error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    })
  }
}
