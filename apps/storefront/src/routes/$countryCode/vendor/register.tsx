import { createFileRoute } from "@tanstack/react-router"
import { VendorRegistrationForm } from "@/components/vendor/vendor-registration-form"

export const Route = createFileRoute("/$countryCode/vendor/register")({
  component: VendorRegisterRoute,
})

function VendorRegisterRoute() {
  return (
    <div className="container mx-auto py-12">
      <VendorRegistrationForm />
    </div>
  )
}
