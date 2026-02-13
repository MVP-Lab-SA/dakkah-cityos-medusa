import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("fitness") as any
    const { id } = req.params
    try {
      const item = await mod.retrieveClassSchedule(id)
      if (item) return res.json({ item })
    } catch {}
    try {
      const item = await mod.retrieveTrainerProfile(id)
      if (item) return res.json({ item })
    } catch {}
    try {
      const item = await mod.retrieveGymMembership(id)
      if (item) return res.json({ item })
    } catch {}
    return res.status(404).json({ message: "Not found" })
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch fitness item", error: error.message })
  }
}
