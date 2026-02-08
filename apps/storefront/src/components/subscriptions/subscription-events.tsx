import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"
import type { SubscriptionEvent } from "@/lib/types/subscriptions"

interface SubscriptionEventsProps {
  subscriptionId: string
}

export function SubscriptionEvents({ subscriptionId }: SubscriptionEventsProps) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.subscriptions.events(subscriptionId),
    queryFn: async () => {
      const response = await sdk.client.fetch<{ events: SubscriptionEvent[] }>(
        `/store/subscriptions/${subscriptionId}/events`,
        { credentials: "include" }
      )
      return response.events || []
    },
    enabled: !!subscriptionId,
  })

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-muted rounded w-1/3 mb-4"></div>
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-muted rounded"></div>)}</div>
      </div>
    )
  }

  const events = data || []

  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b bg-muted/20">
        <h3 className="font-semibold">Activity Timeline</h3>
      </div>
      {events.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">No activity yet</div>
      ) : (
        <div className="p-4 space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex gap-3">
              <div className="mt-1">
                <EventDot type={event.event_type} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{event.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EventDot({ type }: { type: string }) {
  const colors: Record<string, string> = {
    created: "bg-blue-500",
    activated: "bg-green-500",
    paused: "bg-yellow-500",
    resumed: "bg-green-500",
    cancelled: "bg-red-500",
    renewed: "bg-blue-500",
    plan_changed: "bg-purple-500",
    payment_failed: "bg-red-500",
    payment_succeeded: "bg-green-500",
    trial_started: "bg-indigo-500",
    trial_ended: "bg-orange-500",
  }

  return <div className={`w-3 h-3 rounded-full ${colors[type] || "bg-gray-400"}`}></div>
}
