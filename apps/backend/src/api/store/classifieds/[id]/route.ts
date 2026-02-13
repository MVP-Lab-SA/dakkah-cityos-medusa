import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("classified") as any
    const { id } = req.params
    const item = await mod.retrieveClassifiedListing(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Classified listing not found" })
    }
    res.status(500).json({ message: "Failed to fetch classified listing", error: error.message })
  }
}
