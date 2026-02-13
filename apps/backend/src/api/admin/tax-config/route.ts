import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"

const createSchema = z.object({
  tenant_id: z.string().min(1),
  region_id: z.string().min(1),
  tax_rate: z.number(),
  tax_type: z.enum(["vat", "gst", "sales_tax", "excise"]),
  product_category: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const moduleService = req.scope.resolve("taxConfigModuleService") as any
  const { limit = "20", offset = "0", region_id, tax_type, status, tenant_id } = req.query as Record<string, string | undefined>
  const filters: Record<string, any> = {}
  if (region_id) filters.region_id = region_id
  if (tax_type) filters.tax_type = tax_type
  if (status) filters.status = status
  if (tenant_id) filters.tenant_id = tenant_id
  const items = await moduleService.listTaxRules(filters, { skip: Number(offset), take: Number(limit) })
  return res.json({ items, count: Array.isArray(items) ? items.length : 0, limit: Number(limit), offset: Number(offset) })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const moduleService = req.scope.resolve("taxConfigModuleService") as any
  const validation = createSchema.safeParse(req.body)
  if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
  const item = await moduleService.createTaxRules(validation.data)
  return res.status(201).json({ item })
}
