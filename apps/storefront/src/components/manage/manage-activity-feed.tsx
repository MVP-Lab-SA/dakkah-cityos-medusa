import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"

interface Activity {
  id: string
  type: "order" | "product" | "team" | "setting"
  description: string
  timestamp: string
  actor?: string
}

interface ManageActivityFeedProps {
  activities?: Activity[]
  locale?: string
}

const typeColors: Record<string, string> = {
  order: "bg-ds-primary",
  product: "bg-ds-success",
  team: "bg-ds-warning",
  setting: "bg-ds-accent",
}

export function ManageActivityFeed({ activities = [], locale: localeProp }: ManageActivityFeedProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (activities.length === 0) {
    return (
      <div className="bg-ds-card border border-ds-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.recent_activity")}</h3>
        <p className="text-sm text-ds-muted text-center py-8">{t(locale, "manage.no_activity")}</p>
      </div>
    )
  }

  return (
    <div className="bg-ds-card border border-ds-border rounded-lg p-6">
      <h3 className="text-sm font-semibold text-ds-text mb-4">{t(locale, "manage.recent_activity")}</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${typeColors[activity.type] || "bg-ds-muted"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ds-text">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                {activity.actor && (
                  <span className="text-xs text-ds-muted">{activity.actor}</span>
                )}
                <span className="text-xs text-ds-muted">{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
