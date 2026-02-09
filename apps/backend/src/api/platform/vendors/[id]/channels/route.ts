import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor") as any
  const tenantModule = req.scope.resolve("tenant") as any
  const { id } = req.params

  try {
    const [vendor] = await vendorModule.listVendors({ id }, { take: 1 })
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" })
    }

    let channels = await tenantModule.listServiceChannels({ tenant_id: vendor.tenant_id })
    channels = Array.isArray(channels) ? channels : [channels].filter(Boolean)

    res.json({ channels, count: channels.length })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch channels", error: error.message })
  }
}
