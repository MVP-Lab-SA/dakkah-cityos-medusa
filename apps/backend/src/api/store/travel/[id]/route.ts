import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("travel") as any
  const { id } = req.params
  const [item] = await mod.listTravelProperties({ id }, { take: 1 })
  if (!item) return res.status(404).json({ message: "Not found" })
  const roomTypes = await mod.listRoomTypes({ property_id: id }, { take: 100 })
  return res.json({ item: { ...item, room_types: roomTypes } })
}
