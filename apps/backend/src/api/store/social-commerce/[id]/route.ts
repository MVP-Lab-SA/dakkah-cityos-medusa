import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("socialCommerce") as any
  const { id } = req.params
  const { type } = req.query as Record<string, string | undefined>

  if (type === "group_buy") {
    const [item] = await mod.listGroupBuys({ id }, { take: 1 })
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  }

  const [item] = await mod.listLiveStreams({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  return res.json({ item })
}
