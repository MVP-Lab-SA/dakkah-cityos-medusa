import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const moduleService = req.scope.resolve("promotionExt") as any
  const { limit = "20", offset = "0", tenant_id, bundle_type } = req.query as Record<string, string | undefined>

  try {
    const filters: Record<string, any> = { is_active: true }
    if (tenant_id) filters.tenant_id = tenant_id
    if (bundle_type) filters.bundle_type = bundle_type

    const now = new Date()
    const items = await moduleService.listProductBundles(filters, {
      skip: Number(offset),
      take: Number(limit),
      order: { created_at: "DESC" },
    })

    const bundleList = Array.isArray(items) ? items : [items].filter(Boolean)

    const activeBundles = bundleList.filter((bundle: any) => {
      if (bundle.starts_at && new Date(bundle.starts_at) > now) return false
      if (bundle.ends_at && new Date(bundle.ends_at) < now) return false
      return true
    })

    res.json({
      bundles: activeBundles,
      count: activeBundles.length,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch bundles", error: error.message })
  }
}
