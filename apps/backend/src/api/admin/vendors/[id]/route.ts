import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"

const updateVendorSchema = z.object({
  businessName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.enum(["onboarding", "active", "inactive", "suspended", "terminated"]).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const vendorModule = req.scope.resolve("vendor") as any
  const { id } = req.params

  const vendor = await vendorModule.retrieveVendor(id)

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" })
  }

  return res.json({ vendor })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const vendorModule = req.scope.resolve("vendor") as any
  const { id } = req.params

  const validation = updateVendorSchema.safeParse(req.body)
  
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.issues,
    })
  }

  const vendor = await vendorModule.updateVendors({
    id,
    business_name: validation.data.businessName,
    email: validation.data.email,
    phone: validation.data.phone,
    status: validation.data.status,
    commission_rate: validation.data.commissionRate,
    metadata: validation.data.metadata,
  })

  return res.json({ vendor })
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const vendorModule = req.scope.resolve("vendor") as any
  const { id } = req.params

  await vendorModule.deleteVendors([id])

  return res.status(204).send()
}
