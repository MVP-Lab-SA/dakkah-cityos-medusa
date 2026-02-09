import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("charity") as any
  const { id } = req.params
  const [charity] = await mod.listCharityOrgs({ id }, { take: 1 })
  if (charity) {
    const campaigns = await mod.listDonationCampaigns({ charity_org_id: id }, { take: 100 })
    return res.json({ item: { ...charity, campaigns } })
  }
  const [campaign] = await mod.listDonationCampaigns({ id }, { take: 1 })
  if (campaign) return res.json({ item: campaign })
  return res.status(404).json({ message: "Not found" })
}
