import { createFileRoute } from "@tanstack/react-router"
import { AccountLayout, ProfileForm } from "@/components/account"

export const Route = createFileRoute("/$countryCode/account/profile")({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <AccountLayout title="Profile" description="Manage your personal information">
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <h2 className="text-lg font-semibold text-zinc-900 mb-6">Personal Information</h2>
        <ProfileForm />
      </div>
    </AccountLayout>
  )
}
