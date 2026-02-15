import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const automotiveService = req.scope.resolve("automotive") as any
    const { id } = req.params
    const item = await automotiveService.retrieveTradeIn(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Trade-in not found" })
    }
    res.status(500).json({ message: "Failed to fetch trade-in", error: error.message })
  }
}
