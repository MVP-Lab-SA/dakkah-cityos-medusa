import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("insurance") as any
    const { id } = req.params

    try {
      const item = await mod.retrieveInsurancePolicy(id)
      if (item) return res.json({ item })
    } catch {}

    try {
      const item = await mod.retrieveInsuranceClaim(id)
      if (item) return res.json({ item })
    } catch {}

    return res.status(404).json({ message: "Insurance item not found" })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Insurance item not found" })
    }
    res.status(500).json({ message: "Failed to fetch insurance item", error: error.message })
  }
}
