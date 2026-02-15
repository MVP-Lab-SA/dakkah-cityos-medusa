import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const moduleService = req.scope.resolve("membership") as any
    const { id } = req.params
    const item = await moduleService.retrieveMembership(id)
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })
  } catch (error: any) {
    if (error.type === "not_found" || error.message?.includes("not found")) {
      return res.status(404).json({ message: "Membership not found" })
    }
    res.status(500).json({ message: "Failed to fetch membership", error: error.message })
  }
}
