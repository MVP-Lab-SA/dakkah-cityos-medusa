import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const service = req.scope.resolve("dispute") as any
    const dispute = await service.resolve({
      disputeId: req.params.id,
      resolution: req.body?.resolution,
      resolutionAmount: req.body?.resolution_amount,
      resolvedBy: req.body?.resolved_by || "admin",
      notes: req.body?.notes,
    })
    res.json({ dispute })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
