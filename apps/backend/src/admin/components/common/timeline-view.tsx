import { Text } from "@medusajs/ui"

type TimelineEvent = {
  id: string
  title: string
  description?: string
  timestamp: string | Date
  type?: "default" | "success" | "warning" | "error" | "info"
  actor?: string
  icon?: React.ReactNode
}

type TimelineViewProps = {
  events: TimelineEvent[]
  showRelativeTime?: boolean
}

function formatTimeAgo(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export function TimelineView({ events, showRelativeTime = true }: TimelineViewProps) {
  const typeColors: Record<string, string> = {
    default: "bg-ui-fg-muted",
    success: "bg-ui-tag-green-icon",
    warning: "bg-ui-tag-orange-icon",
    error: "bg-ui-tag-red-icon",
    info: "bg-ui-tag-blue-icon",
  }

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={event.id} className="flex gap-3">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full ${
                typeColors[event.type || "default"]
              }`}
            />
            {idx < events.length - 1 && (
              <div className="w-px flex-1 bg-ui-border-base mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <Text className="font-medium">{event.title}</Text>
                {event.description && (
                  <Text className="text-ui-fg-muted text-sm mt-0.5">
                    {event.description}
                  </Text>
                )}
              </div>
              <Text className="text-ui-fg-muted text-sm whitespace-nowrap ml-4">
                {showRelativeTime ? formatTimeAgo(event.timestamp) : (
                  typeof event.timestamp === "string" 
                    ? new Date(event.timestamp).toLocaleString()
                    : event.timestamp.toLocaleString()
                )}
              </Text>
            </div>
            {event.actor && (
              <Text className="text-ui-fg-subtle text-xs mt-1">
                by {event.actor}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
