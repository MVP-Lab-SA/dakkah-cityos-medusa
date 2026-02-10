import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout, ProfileForm } from "@/components/account"

export const Route = createFileRoute("/$tenant/$locale/account/profile")({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <AccountLayout title="Profile" description="Manage your personal information">
      <div className="bg-ds-background rounded-lg border border-ds-border p-6">
        <h2 className="text-lg font-semibold text-ds-foreground mb-6">Personal Information</h2>
        <ProfileForm />
      </div>
    </AccountLayout>
  )
}
