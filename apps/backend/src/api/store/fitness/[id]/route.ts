import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mod = req.scope.resolve("fitness") as any
  const { id } = req.params
  const [classItem] = await mod.listClassSchedules({ id }, { take: 1 })
  if (classItem) return res.json({ item: classItem })
  const [trainer] = await mod.listTrainerProfiles({ id }, { take: 1 })
  if (trainer) return res.json({ item: trainer })
  const [membership] = await mod.listGymMemberships({ id }, { take: 1 })
  if (membership) return res.json({ item: membership })
  return res.status(404).json({ message: "Not found" })
}
