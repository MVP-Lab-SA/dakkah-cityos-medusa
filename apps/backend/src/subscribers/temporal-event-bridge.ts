import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { dispatchEventToTemporal } from "../lib/event-dispatcher"

export default async function temporalEventBridge({
  event,
  container,
}: SubscriberArgs<any>) {
  const eventName = event.name

  if (!process.env.TEMPORAL_API_KEY) {
    return
  }

  try {
    const result = await dispatchEventToTemporal(eventName, event.data, {
      source: "medusa-subscriber",
      timestamp: new Date().toISOString(),
    })

    if (result.dispatched) {
      console.log(
        `[TemporalBridge] Dispatched ${eventName} → runId: ${result.runId}`
      )
    }
  } catch (err: any) {
    console.warn(
      `[TemporalBridge] Failed to dispatch ${eventName}:`,
      err.message
    )
  }
}

export const config: SubscriberConfig = {
  event: [
    "order.placed",
    "order.updated",
    "product.updated",
  ],
}
