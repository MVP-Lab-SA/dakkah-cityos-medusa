import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function integrationSyncHandler({ event }: SubscriberArgs<any>) {
  // All integration sync is now handled via Temporal workflows
  // dispatched by temporal-event-bridge subscriber.
  // This subscriber is kept as a no-op for documentation.
}

export const config: SubscriberConfig = {
  event: [],
}
