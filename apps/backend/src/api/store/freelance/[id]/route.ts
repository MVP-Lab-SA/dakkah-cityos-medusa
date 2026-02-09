import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("freelance") as any
  const { id } = req.params
  const [item] = await mod.listGigListings({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  return res.json({ item })
}
