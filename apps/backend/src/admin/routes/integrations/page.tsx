import { Container, Heading } from "@medusajs/ui";

export default function IntegrationsPage() {
  return (
    <Container>
      <div className="flex flex-col gap-y-4">
        <Heading level="h1">Integrations</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stripe Connect */}
          <Container>
            <Heading level="h2">Stripe Connect</Heading>
            <p className="text-sm text-ui-fg-subtle mt-2">
              Manage vendor payouts and connected accounts
            </p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Active
              </span>
            </div>
          </Container>

          {/* Payload CMS */}
          <Container>
            <Heading level="h2">Payload CMS</Heading>
            <p className="text-sm text-ui-fg-subtle mt-2">
              Bi-directional content synchronization
            </p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Syncing
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Last: 2 mins ago
              </span>
            </div>
          </Container>

          {/* Fleetbase */}
          <Container>
            <Heading level="h2">Fleetbase Logistics</Heading>
            <p className="text-sm text-ui-fg-subtle mt-2">
              Real-time delivery and shipment tracking
            </p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Active
              </span>
            </div>
          </Container>

          {/* ERPNext */}
          <Container>
            <Heading level="h2">ERPNext</Heading>
            <p className="text-sm text-ui-fg-subtle mt-2">
              Accounting and financial synchronization
            </p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Active
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Last sync: 1 hour ago
              </span>
            </div>
          </Container>
        </div>

        {/* Sync Status */}
        <Container className="mt-4">
          <Heading level="h2">Synchronization Status</Heading>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Products → Payload</span>
              <span className="text-xs text-ui-fg-subtle">
                1,234 synced | 2 pending
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Content → Medusa</span>
              <span className="text-xs text-ui-fg-subtle">
                456 synced | 0 pending
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Orders → ERPNext</span>
              <span className="text-xs text-ui-fg-subtle">
                789 synced | 5 pending
              </span>
            </div>
          </div>
        </Container>
      </div>
    </Container>
  );
}

export const config = {
  link: {
    label: "Integrations",
  },
};
