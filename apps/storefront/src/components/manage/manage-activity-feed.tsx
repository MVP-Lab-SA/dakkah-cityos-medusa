import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import { SectionCard } from "@/components/manage/ui"
import { ShoppingCart, Tag, Users, CogSixTooth } from "@medusajs/icons"
import { type ReactNode } from "react"

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

const typeIcons: Record<string, ReactNode> = {
  order: <ShoppingCart className="w-3.5 h-3.5" />,
  product: <Tag className="w-3.5 h-3.5" />,
  team: <Users className="w-3.5 h-3.5" />,
  setting: <CogSixTooth className="w-3.5 h-3.5" />,
}

const typeColors: Record<string, string> = {
  order: "bg-ds-primary/10 text-ds-primary",
  product: "bg-ds-success/10 text-ds-success",
  team: "bg-ds-warning/10 text-ds-warning",
  setting: "bg-ds-accent text-ds-muted-foreground",
}

export function ManageActivityFeed({ activities = [], locale: localeProp }: ManageActivityFeedProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  return (
    <SectionCard title={t(locale, "manage.recent_activity")}>
      {activities.length === 0 ? (
        <p className="text-sm text-ds-muted-foreground text-center py-8">{t(locale, "manage.no_activity")}</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${typeColors[activity.type] || "bg-ds-muted text-ds-muted-foreground"}`}>
                {typeIcons[activity.type] || null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ds-text">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  {activity.actor && (
                    <span className="text-xs text-ds-muted-foreground">{activity.actor}</span>
                  )}
                  <span className="text-xs text-ds-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
