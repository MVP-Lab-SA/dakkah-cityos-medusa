import { useState } from "react"
import { useVendorTeam, useInviteVendorTeamMember, useUpdateVendorTeamMember, useRemoveVendorTeamMember } from "@/lib/hooks/use-vendor-team"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { VendorUser } from "@/lib/types/vendors"

export function VendorTeam() {
  const { data: members, isLoading } = useVendorTeam()
  const inviteMutation = useInviteVendorTeamMember()
  const updateMutation = useUpdateVendorTeamMember()
  const removeMutation = useRemoveVendorTeamMember()
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<VendorUser["role"]>("staff")

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    await inviteMutation.mutateAsync({ email: inviteEmail.trim(), role: inviteRole })
    setInviteEmail("")
    setShowInvite(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Button onClick={() => setShowInvite(!showInvite)}>
          {showInvite ? "Cancel" : "Invite Member"}
        </Button>
      </div>

      {showInvite && (
        <div className="border rounded-lg p-6 bg-muted/20">
          <h3 className="font-semibold mb-4">Invite Team Member</h3>
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as VendorUser["role"])}
              className="border rounded px-3 py-2"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <Button onClick={handleInvite} disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg divide-y">
        {(!members || members.length === 0) ? (
          <div className="p-6 text-center text-muted-foreground">
            No team members yet. Invite your first team member.
          </div>
        ) : (
          members.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {member.first_name} {member.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <RoleBadge role={member.role} />
                <StatusBadge active={member.is_active} />
                {member.role !== "owner" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMutation.mutate(member.id)}
                    disabled={removeMutation.isPending}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    owner: "bg-purple-100 text-purple-800",
    admin: "bg-blue-100 text-blue-800",
    manager: "bg-green-100 text-green-800",
    staff: "bg-gray-100 text-gray-800",
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[role] || "bg-gray-100"}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  )
}
