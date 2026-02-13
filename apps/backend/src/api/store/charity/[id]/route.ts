import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("charity") as any
    const { id } = req.params
    try {
      const charity = await mod.retrieveCharityOrg(id)
      if (charity) {
        const campaigns = await mod.listDonationCampaigns({ charity_org_id: id }, { take: 100 })
        return res.json({ item: { ...charity, campaigns } })
      }
    } catch {
      const campaign = await mod.retrieveDonationCampaign(id)
      if (campaign) return res.json({ item: campaign })
    }
    return res.status(404).json({ message: "Not found" })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Charity or campaign not found" })
    }
    res.status(500).json({ message: "Failed to fetch charity", error: error.message })
  }
}
