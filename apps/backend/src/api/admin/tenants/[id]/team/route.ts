import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// GET - List tenant team members
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const query = req.scope.resolve("query")

  const { data: members } = await query.graph({
    entity: "tenant_user",
    fields: [
      "id",
      "user_id",
      "user.email",
      "user.first_name",
      "user.last_name",
      "role",
      "permissions",
      "invited_at",
      "joined_at",
      "status",
      "last_active_at"
    ],
    filters: { tenant_id: id }
  })

  res.json({ members })
}

// POST - Invite team member
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { email, role, permissions } = req.body as {
    email: string
    role: "owner" | "admin" | "member"
    permissions?: string[]
  }

  const tenantService = req.scope.resolve("tenantModuleService")
  const query = req.scope.resolve("query")

  // Check if user already a member
  const { data: existing } = await query.graph({
    entity: "tenant_user",
    fields: ["id"],
    filters: { tenant_id: id, "user.email": email }
  })

  if (existing.length > 0) {
    return res.status(400).json({ message: "User is already a team member" })
  }

  // Create invitation
  const invitation = await tenantService.createTenantInvitations({
    tenant_id: id,
    email,
    role,
    permissions: permissions || [],
    invited_at: new Date(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    status: "pending"
  })

  // TODO: Send invitation email

  res.status(201).json({
    message: "Invitation sent",
    invitation
  })
}
