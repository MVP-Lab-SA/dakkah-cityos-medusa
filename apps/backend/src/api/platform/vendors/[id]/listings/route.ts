import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  const { id } = req.params
  const { host_tenant_id, status } = req.query

  try {
    const [vendor] = await vendorModule.listVendors({ id }, { take: 1 })
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    const filters: Record<string, unknown> = { vendor_tenant_id: vendor.tenant_id }
    if (host_tenant_id) filters.host_tenant_id = host_tenant_id
    if (status) filters.status = status

    let listings = await vendorModule.listMarketplaceListings(filters)
    listings = Array.isArray(listings) ? listings : [listings].filter(Boolean)

    res.json({ listings, count: listings.length })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch listings", error: error.message })
  }
}
