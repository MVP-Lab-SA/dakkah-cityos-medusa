import React, { type ReactNode } from "react"
import { t } from "@/lib/i18n"
import { SectionCard } from "@/components/manage/ui/section-card"
import { ShoppingCart, Tag, Users, CogSixTooth } from "@medusajs/icons"

interface ManageActivityBlockProps {
  heading?: string
  activities?: Array<{
    type: "order" | "product" | "team" | "setting"
    description: string
    timestamp: string
    actor?: string
  }>
  limit?: number
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

export const ManageActivityBlock: React.FC<ManageActivityBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading,
  activities = [],
  limit = 10,
  locale = "en",
}) => {
  const displayActivities = activities.slice(0, limit)

  return (
    <section className="py-6">
      <SectionCard title={heading || t(locale, "manage.recent_activity")}>
        {displayActivities.length === 0 ? (
          <p className="text-sm text-ds-muted-foreground text-center py-8">
            {t(locale, "manage.no_activity")}
          </p>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                    typeColors[activity.type] || "bg-ds-muted text-ds-muted-foreground"
                  }`}
                >
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
    </section>
  )
}
