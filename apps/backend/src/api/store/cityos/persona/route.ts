import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const tenantId = req.nodeContext?.tenantId || req.query?.tenant_id as string
  const userId = req.nodeContext?.userId || req.query?.user_id as string

  if (!tenantId) {
    return res.status(400).json({ message: "Tenant context required" })
  }

  try {
    const personaModule = req.scope.resolve("persona") as any
    
    if (userId) {
      const persona = await personaModule.resolvePersona(tenantId, userId, {
        surface: req.nodeContext?.channel,
      })
      return res.json({ persona })
    }

    const personas = await personaModule.getPersonasForTenant(tenantId)
    return res.json({ personas })
  } catch (error: any) {
    console.error("Persona error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
