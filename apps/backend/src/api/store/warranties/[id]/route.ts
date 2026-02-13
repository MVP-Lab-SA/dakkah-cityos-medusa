import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("warranty") as any
    const { id } = req.params
    const [item] = await mod.listWarrantyPlans({ id }, { take: 1 })
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch warranty plan"
    return res.status(500).json({ message, error: process.env.NODE_ENV === "development" ? error : undefined })
  }
}
