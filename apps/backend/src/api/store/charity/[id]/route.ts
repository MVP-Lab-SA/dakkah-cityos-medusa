import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("charity") as any
  const { id } = req.params

  try {
    const charity = await mod.retrieveCharityOrg(id)
    if (charity) {
      let campaigns = []
      try {
        const result = await mod.listDonationCampaigns({ charity_org_id: id }, { take: 100 })
        campaigns = Array.isArray(result) ? result : result?.[0] || []
      } catch (e: any) {
        console.error(`[charity/${id}] Failed to list campaigns:`, e?.message)
      }
      return res.json({ item: { ...charity, campaigns } })
    }
  } catch (e: any) {
    const isNotFound = e?.type === "not_found" || e?.code === "NOT_FOUND" || e?.message?.includes("not found") || e?.message?.includes("does not exist")
    if (!isNotFound) {
      console.error(`[charity/${id}] retrieveCharityOrg error:`, e?.message)
      return res.status(500).json({ message: "Internal error retrieving charity" })
    }
  }

  try {
    const campaign = await mod.retrieveDonationCampaign(id)
    if (campaign) {
      let org = null
      try {
        org = await mod.retrieveCharityOrg((campaign as any).charity_org_id)
      } catch (e: any) {
        console.error(`[charity/${id}] Failed to retrieve parent org:`, e?.message)
      }
      return res.json({ item: { ...campaign, organization: org } })
    }
  } catch (e: any) {
    const isNotFound = e?.type === "not_found" || e?.code === "NOT_FOUND" || e?.message?.includes("not found") || e?.message?.includes("does not exist")
    if (!isNotFound) {
      console.error(`[charity/${id}] retrieveDonationCampaign error:`, e?.message)
      return res.status(500).json({ message: "Internal error retrieving campaign" })
    }
  }

  try {
    const [charities] = await mod.listCharityOrgs({}, { take: 100 })
    const charityList = Array.isArray(charities) ? charities : [charities].filter(Boolean)
    const match = charityList.find((c: any) => c.id === id || c.slug === id || c.handle === id)
    if (match) {
      let campaigns = []
      try {
        const result = await mod.listDonationCampaigns({ charity_org_id: match.id }, { take: 100 })
        campaigns = Array.isArray(result) ? result : result?.[0] || []
      } catch (e: any) {
        console.error(`[charity/${id}] Failed to list campaigns for matched org:`, e?.message)
      }
      return res.json({ item: { ...match, campaigns } })
    }
  } catch (e: any) {
    console.error(`[charity/${id}] listCharityOrgs error:`, e?.message)
    return res.status(500).json({ message: "Internal error searching charities" })
  }

  return res.status(404).json({ message: "Charity or campaign not found" })
}
