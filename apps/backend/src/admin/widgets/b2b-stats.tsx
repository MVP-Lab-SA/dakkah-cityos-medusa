import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading } from "@medusajs/ui";

/**
 * B2B Statistics Widget
 * Shows key B2B metrics on dashboard
 */
const B2BStatsWidget = () => {
  return (
    <Container>
      <div className="flex flex-col gap-y-2">
        <Heading level="h2">B2B Overview</Heading>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-ui-fg-subtle text-sm">Active Companies</div>
            <div className="text-2xl font-semibold">--</div>
          </div>
          <div>
            <div className="text-ui-fg-subtle text-sm">Pending Quotes</div>
            <div className="text-2xl font-semibold">--</div>
          </div>
          <div>
            <div className="text-ui-fg-subtle text-sm">Credit Utilized</div>
            <div className="text-2xl font-semibold">--</div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.list.before",
});

export default B2BStatsWidget;
