import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const tenantId = req.nodeContext?.tenantId || req.query?.tenant_id as string

  if (!tenantId) {
    return res.status(400).json({ message: "Tenant context required" })
  }

  try {
    const governanceModule = req.scope.resolve("governance") as any
    const policies = await governanceModule.resolveEffectivePolicies(tenantId)
    return res.json({ policies })
  } catch (error: any) {
    console.error("Governance error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
