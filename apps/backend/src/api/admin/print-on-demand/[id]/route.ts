import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { handleApiError } from "../../../../lib/api-error-handler"

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  product_type: z.string().optional(),
  design_url: z.string().optional(),
  base_cost: z.number().optional(),
  retail_price: z.number().optional(),
  provider: z.string().optional(),
  status: z.enum(["active", "inactive", "discontinued"]).optional(),
  tenant_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("printOnDemand") as any
    const { id } = req.params
    const [item] = await mod.listPodProducts({ id }, { take: 1 })
    if (!item) return res.status(404).json({ message: "Not found" })
    return res.json({ item })

  } catch (error: any) {
    handleApiError(res, error, "GET admin print-on-demand id")}
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("printOnDemand") as any
    const { id } = req.params
    const validation = updateSchema.safeParse(req.body)
    if (!validation.success) return res.status(400).json({ message: "Validation failed", errors: validation.error.issues })
    const item = await mod.updatePodProducts({ id, ...validation.data })
    return res.json({ item })

  } catch (error: any) {
    handleApiError(res, error, "POST admin print-on-demand id")}
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  try {
    const mod = req.scope.resolve("printOnDemand") as any
    const { id } = req.params
    await mod.deletePodProducts([id])
    return res.status(204).send()

  } catch (error: any) {
    handleApiError(res, error, "DELETE admin print-on-demand id")}
}
