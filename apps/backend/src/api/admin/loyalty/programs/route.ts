import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("loyalty") as any
    const programs = await service.listLoyaltyPrograms({})
    res.json({ programs: Array.isArray(programs) ? programs : [programs].filter(Boolean) })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("loyalty") as any
    const program = await service.createLoyaltyPrograms(req.body)
    res.status(201).json({ program })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
