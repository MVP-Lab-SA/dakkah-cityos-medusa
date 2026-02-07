// @ts-nocheck
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// PUT - Update team member role/permissions
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id, userId } = req.params
  const { role, permissions } = req.body as {
    role?: "owner" | "admin" | "member"
    permissions?: string[]
  }

  const tenantService = req.scope.resolve("tenantModuleService")
  const query = req.scope.resolve("query")

  // Verify member exists
  const { data: members } = await query.graph({
    entity: "tenant_user",
    fields: ["id", "role"],
    filters: { tenant_id: id, user_id: userId }
  })

  if (!members.length) {
    return res.status(404).json({ message: "Team member not found" })
  }

  // Prevent removing last owner
  if (members[0].role === "owner" && role !== "owner") {
    const { data: owners } = await query.graph({
      entity: "tenant_user",
      fields: ["id"],
      filters: { tenant_id: id, role: "owner" }
    })

    if (owners.length <= 1) {
      return res.status(400).json({ message: "Cannot remove the last owner" })
    }
  }

  await tenantService.updateTenantUsers({
    selector: { tenant_id: id, user_id: userId },
    data: {
      ...(role && { role }),
      ...(permissions && { permissions })
    }
  })

  res.json({ message: "Team member updated" })
}

// DELETE - Remove team member
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id, userId } = req.params
  const tenantService = req.scope.resolve("tenantModuleService")
  const query = req.scope.resolve("query")

  // Verify member exists
  const { data: members } = await query.graph({
    entity: "tenant_user",
    fields: ["id", "role"],
    filters: { tenant_id: id, user_id: userId }
  })

  if (!members.length) {
    return res.status(404).json({ message: "Team member not found" })
  }

  // Prevent removing last owner
  if (members[0].role === "owner") {
    const { data: owners } = await query.graph({
      entity: "tenant_user",
      fields: ["id"],
      filters: { tenant_id: id, role: "owner" }
    })

    if (owners.length <= 1) {
      return res.status(400).json({ message: "Cannot remove the last owner" })
    }
  }

  await tenantService.deleteTenantUsers(members[0].id)

  res.json({ message: "Team member removed", user_id: userId })
}
