import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading } from "@medusajs/ui";

/**
 * B2B Quotes Management Page
 */
const QuotesPage = () => {
  return (
    <Container>
      <div className="flex flex-col gap-y-4">
        <Heading level="h1">B2B Quotes</Heading>
        <div className="text-ui-fg-subtle">
          Review and approve quote requests from B2B customers.
        </div>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Quotes",
  icon: "DocumentText",
});

export default QuotesPage;
