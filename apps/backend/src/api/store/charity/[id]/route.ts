import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { handleApiError } from "../../../../lib/api-error-handler"

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
      } catch (error: any) {}
      return res.json({ item: { ...charity, campaigns } })
    }
  } catch (error: any) {
    const isNotFound = error?.type === "not_found" || error?.code === "NOT_FOUND" || error?.message?.includes("not found") || error?.message?.includes("does not exist")
    if (!isNotFound) {
      return handleApiError(res, error, "STORE-CHARITY-ID")}
  }

  try {
    const campaign = await mod.retrieveDonationCampaign(id)
    if (campaign) {
      let org = null
      try {
        org = await mod.retrieveCharityOrg((campaign as any).charity_org_id)
      } catch (error: any) {}
      return res.json({ item: { ...campaign, organization: org } })
    }
  } catch (error: any) {
    const isNotFound = error?.type === "not_found" || error?.code === "NOT_FOUND" || error?.message?.includes("not found") || error?.message?.includes("does not exist")
    if (!isNotFound) {
      return handleApiError(res, error, "STORE-CHARITY-ID")}
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
      } catch (error: any) {}
      return res.json({ item: { ...match, campaigns } })
    }
  } catch (error: any) {
    return handleApiError(res, error, "STORE-CHARITY-ID")}

  return res.status(404).json({ message: "Charity or campaign not found" })
}

