import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("grocery") as any
    const { id } = req.params
    const item = await mod.retrieveFreshProduct(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Grocery product not found" })
    }
    res.status(500).json({ message: "Failed to fetch grocery product", error: error.message })
  }
}
