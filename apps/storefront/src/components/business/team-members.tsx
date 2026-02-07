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
    buyer: "bg-blue-100 text-blue-800",
    approver: "bg-green-100 text-green-800",
    viewer: "bg-zinc-100 text-zinc-800",
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
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Team Members</h3>
        {canManage && (
          <Button size="sm" onClick={() => setShowInviteForm(!showInviteForm)}>
            <Plus className="w-4 h-4 mr-1" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="p-6 border-b border-zinc-200 bg-zinc-50">
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
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
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
      <div className="divide-y divide-zinc-100">
        {members.length === 0 ? (
          <div className="p-8 text-center">
            <User className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">No team members yet</p>
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900">{member.name}</p>
                  <p className="text-sm text-zinc-500">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                  {roleLabels[member.role]}
                </span>

                {member.status === "invited" && (
                  <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
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
                      className="text-red-600 hover:text-red-700"
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
