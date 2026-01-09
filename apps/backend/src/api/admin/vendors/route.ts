import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"
import { createVendorWorkflow } from "../../../workflows/vendor/create-vendor-workflow"
import { approveVendorWorkflow } from "../../../workflows/vendor/approve-vendor-workflow"

const createVendorSchema = z.object({
  handle: z.string().min(2),
  businessName: z.string().min(2),
  legalName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    countryCode: z.string(),
  }),
  commissionRate: z.number().min(0).max(100).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorModule = req.scope.resolve("vendor")
  const context = (req as any).cityosContext

  if (!context?.tenantId) {
    return res.status(403).json({ message: "Tenant context required" })
  }

  const { limit = 20, offset = 0 } = req.query

  const [vendors, count] = await vendorModule.listAndCountVendors(
    {
      tenant_id: context.tenantId,
      ...(context.storeId && { store_id: context.storeId }),
    },
    {
      skip: Number(offset),
      take: Number(limit),
      relations: [],
    }
  )

  return res.json({
    vendors,
    count,
    limit: Number(limit),
    offset: Number(offset),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const context = (req as any).cityosContext

  if (!context?.tenantId) {
    return res.status(403).json({ message: "Tenant context required" })
  }

  const validation = createVendorSchema.safeParse(req.body)
  
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.errors,
    })
  }

  const { result } = await createVendorWorkflow(req.scope).run({
    input: {
      tenantId: context.tenantId,
      storeId: context.storeId,
      ...validation.data,
    },
  })

  return res.status(201).json({ vendor: result.vendor })
}
