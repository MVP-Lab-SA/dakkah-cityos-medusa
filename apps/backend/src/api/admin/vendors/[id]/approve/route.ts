import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"
import { approveVendorWorkflow } from "../../../../../workflows/vendor/approve-vendor-workflow.js"

const approveVendorSchema = z.object({
  notes: z.string().optional(),
})

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const auth = (req as any).auth

  const validation = approveVendorSchema.safeParse(req.body)
  
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.issues,
    })
  }

  const { result } = await approveVendorWorkflow(req.scope).run({
    input: {
      vendorId: id,
      approvedBy: auth?.userId || "system",
      notes: validation.data.notes,
    },
  })

  return res.json({ vendor: result.vendor })
}
