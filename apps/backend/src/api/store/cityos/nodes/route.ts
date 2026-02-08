import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const tenantId = req.nodeContext?.tenantId || req.query?.tenant_id as string
  const parentId = req.query?.parent_id as string
  const type = req.query?.type as string

  if (!tenantId) {
    return res.status(400).json({ message: "Tenant context required" })
  }

  try {
    const nodeModule = req.scope.resolve("node") as any
    
    const filters: any = { tenant_id: tenantId }
    if (parentId) filters.parent_id = parentId
    if (type) filters.type = type

    const nodes = await nodeModule.listNodesByTenant(tenantId, filters)
    return res.json({ nodes })
  } catch (error: any) {
    console.error("Node list error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
