import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"
import { processPayoutWorkflow } from "../../../workflows/vendor/process-payout-workflow"

const createPayoutSchema = z.object({
  vendorId: z.string(),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  paymentMethod: z.enum(["stripe_connect", "bank_transfer", "paypal", "manual"]).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const payoutModule = req.scope.resolve("payout") as any
  const context = (req as any).cityosContext

  if (!context?.tenantId) {
    return res.status(403).json({ message: "Tenant context required" })
  }

  const { limit = 20, offset = 0, vendor_id, status } = req.query

  const filters: any = {
    tenant_id: context.tenantId,
    ...(context.storeId && { store_id: context.storeId }),
  }

  if (vendor_id) filters.vendor_id = vendor_id
  if (status) filters.status = status

  const payouts = await payoutModule.listPayouts(
    filters,
    {
      skip: Number(offset),
      take: Number(limit),
    }
  )

  return res.json({
    payouts,
    count: Array.isArray(payouts) ? payouts.length : 0,
    limit: Number(limit),
    offset: Number(offset),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const context = (req as any).cityosContext

  if (!context?.tenantId) {
    return res.status(403).json({ message: "Tenant context required" })
  }

  const validation = createPayoutSchema.safeParse(req.body)
  
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.issues,
    })
  }

  const { result } = await processPayoutWorkflow(req.scope).run({
    input: {
      vendorId: validation.data.vendorId,
      tenantId: context.tenantId,
      storeId: context.storeId,
      periodStart: new Date(validation.data.periodStart),
      periodEnd: new Date(validation.data.periodEnd),
      paymentMethod: validation.data.paymentMethod,
    },
  })

  return res.status(201).json({ payout: result.payout, transactionCount: result.transactionCount })
}
