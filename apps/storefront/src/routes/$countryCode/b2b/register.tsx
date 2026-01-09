import { createFileRoute } from "@tanstack/react-router";
import { CompanyRegistrationForm } from "@/components/b2b/company-registration-form";

export const Route = createFileRoute("/$countryCode/b2b/register")({
  component: CompanyRegistrationPage,
});

function CompanyRegistrationPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Register Your Business</h1>
        <p className="text-muted-foreground">
          Create a B2B account to access volume pricing, custom quotes,
          and flexible payment terms.
        </p>
      </div>

      <CompanyRegistrationForm />
    </div>
  );
}
