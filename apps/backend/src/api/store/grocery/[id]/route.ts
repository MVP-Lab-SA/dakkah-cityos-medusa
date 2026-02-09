import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("grocery") as any
  const { id } = req.params
  const [item] = await mod.listFreshProducts({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  return res.json({ item })
}
