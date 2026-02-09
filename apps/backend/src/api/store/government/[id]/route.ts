import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("government") as any
  const { id } = req.params
  const [item] = await mod.listServiceRequests({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  return res.json({ item })
}
