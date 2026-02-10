import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Plus, Trash, PencilSquare } from "@medusajs/icons"

interface TeamMember {
  id: string
  email: string
  name: string
  role: "admin" | "buyer" | "approver" | "viewer"
  spending_limit?: number
  status: "active" | "invited" | "deactivated"
  joined_at?: string
}

interface TeamMembersProps {
  members: TeamMember[]
  canManage?: boolean
  onInvite?: (email: string, role: TeamMember["role"]) => Promise<void>
  onRemove?: (memberId: string) => Promise<void>
  onUpdateRole?: (memberId: string, role: TeamMember["role"]) => Promise<void>
}

export function TeamMembers({
  members,
  canManage = false,
  onInvite,
  onRemove,
  onUpdateRole,
}: TeamMembersProps) {
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("buyer")
  const [isInviting, setIsInviting] = useState(false)

  const roleLabels: Record<TeamMember["role"], string> = {
    admin: "Admin",
    buyer: "Buyer",
    approver: "Approver",
    viewer: "Viewer",
  }

  const roleColors: Record<TeamMember["role"], string> = {
    admin: "bg-purple-100 text-purple-800",
    buyer: "bg-ds-info text-ds-info",
    approver: "bg-ds-success text-ds-success",
    viewer: "bg-ds-muted text-ds-foreground",
  }

  const handleInvite = async () => {
    if (!inviteEmail || !onInvite) return
    setIsInviting(true)
    try {
      await onInvite(inviteEmail, inviteRole)
      setInviteEmail("")
      setShowInviteForm(false)
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className="bg-ds-background rounded-xl border border-ds-border overflow-hidden">
      <div className="px-6 py-4 border-b border-ds-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ds-foreground">Team Members</h3>
        {canManage && (
          <Button size="sm" onClick={() => setShowInviteForm(!showInviteForm)}>
            <Plus className="w-4 h-4 me-1" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="p-6 border-b border-ds-border bg-ds-muted">
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
              className="rounded-lg border border-ds-border px-3 py-2 text-sm"
            >
              <option value="buyer">Buyer</option>
              <option value="approver">Approver</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <Button onClick={handleInvite} disabled={!inviteEmail || isInviting}>
              {isInviting ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="divide-y divide-ds-border">
        {members.length === 0 ? (
          <div className="p-8 text-center">
            <User className="w-12 h-12 text-ds-muted-foreground mx-auto mb-4" />
            <p className="text-ds-muted-foreground">No team members yet</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-ds-muted flex items-center justify-center">
                  <User className="w-5 h-5 text-ds-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-ds-foreground">{member.name}</p>
                  <p className="text-sm text-ds-muted-foreground">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                  {roleLabels[member.role]}
                </span>

                {member.status === "invited" && (
                  <span className="px-2 py-0.5 rounded text-xs bg-ds-warning text-ds-warning">
                    Pending
                  </span>
                )}

                {canManage && member.status !== "invited" && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onUpdateRole?.(member.id, member.role)}>
                      <PencilSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-ds-destructive hover:text-ds-destructive"
                      onClick={() => onRemove?.(member.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
