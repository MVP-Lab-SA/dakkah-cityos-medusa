import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account"
import { TeamMembers } from "@/components/business"
import { useAuth } from "@/lib/context/auth-context"

export const Route = createFileRoute("/$countryCode/business/team")({
  component: TeamPage,
})

function TeamPage() {
  const { countryCode } = Route.useParams()
  const { isB2B } = useAuth()

  // Mock team data
  const members = [
    {
      id: "mem_1",
      email: "admin@company.com",
      name: "John Admin",
      role: "admin" as const,
      status: "active" as const,
      joined_at: "2024-01-15",
    },
    {
      id: "mem_2",
      email: "buyer@company.com",
      name: "Sarah Buyer",
      role: "buyer" as const,
      status: "active" as const,
      spending_limit: 5000,
      joined_at: "2024-03-01",
    },
    {
      id: "mem_3",
      email: "approver@company.com",
      name: "Mike Approver",
      role: "approver" as const,
      status: "active" as const,
      joined_at: "2024-02-10",
    },
    {
      id: "mem_4",
      email: "newuser@company.com",
      name: "New User",
      role: "viewer" as const,
      status: "invited" as const,
    },
  ]

  const handleInvite = async (email: string, role: any) => {
    console.log("Inviting:", email, role)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const handleRemove = async (memberId: string) => {
    console.log("Removing:", memberId)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return (
    <AccountLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Team Management</h1>
        <p className="text-zinc-500 mt-1">Manage your company's team members and permissions</p>
      </div>

      <TeamMembers
        members={members}
        canManage={isB2B}
        onInvite={handleInvite}
        onRemove={handleRemove}
      />
    </AccountLayout>
  )
}
