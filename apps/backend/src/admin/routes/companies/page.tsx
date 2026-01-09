import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading } from "@medusajs/ui";

/**
 * B2B Companies Management Page
 */
const CompaniesPage = () => {
  return (
    <Container>
      <div className="flex flex-col gap-y-4">
        <Heading level="h1">B2B Companies</Heading>
        <div className="text-ui-fg-subtle">
          Manage B2B company accounts, credit limits, and approvals.
        </div>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Companies",
  icon: "Buildings",
});

export default CompaniesPage;
