import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { TeamMembers } from "@/components/business"
import { useAuth } from "@/lib/context/auth-context"
import { useCompanyTeam, useInviteTeamMember, useRemoveTeamMember } from "@/lib/hooks/use-companies"
import { Spinner } from "@medusajs/icons"
import { useToast } from "@/components/ui/toast"

export const Route = createFileRoute("/$tenant/$locale/business/team")({
  component: TeamPage,
})

function TeamPage() {
  const { tenant, locale } = Route.useParams()
  const { isB2B } = useAuth()
  const { addToast } = useToast()
  
  const { data: teamData, isLoading, error } = useCompanyTeam()
  const inviteMember = useInviteTeamMember()
  const removeMember = useRemoveTeamMember()

  // Transform API data to component format
  const members = (teamData || []).map((member: any) => ({
    id: member.id,
    email: member.customer?.email || member.email,
    name: member.customer ? `${member.customer.first_name || ""} ${member.customer.last_name || ""}`.trim() : "Pending",
    role: member.role as "admin" | "buyer" | "approver" | "viewer",
    status: member.customer ? "active" as const : "invited" as const,
    spending_limit: member.spending_limit,
    joined_at: member.created_at,
  }))

  const handleInvite = async (email: string, role: any) => {
    try {
      await inviteMember.mutateAsync({ email, role })
      addToast("success", `Invitation sent to ${email}`)
    } catch (err: any) {
      addToast("error", err.message || "Failed to send invitation")
    }
  }

  const handleRemove = async (memberId: string) => {
    try {
      await removeMember.mutateAsync(memberId)
      addToast("success", "Team member removed")
    } catch (err: any) {
      addToast("error", err.message || "Failed to remove team member")
    }
  }

  return (
    <AccountLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ds-foreground">Team Management</h1>
        <p className="text-ds-muted-foreground mt-1">Manage your company's team members and permissions</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-6 h-6 animate-spin text-ds-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="bg-ds-destructive border border-ds-destructive rounded-lg p-4 text-ds-destructive">
          Failed to load team members. Please try again later.
        </div>
      )}

      {!isLoading && !error && (
        <TeamMembers
          members={members}
          canManage={isB2B}
          onInvite={handleInvite}
          onRemove={handleRemove}
        />
      )}
    </AccountLayout>
  )
}
