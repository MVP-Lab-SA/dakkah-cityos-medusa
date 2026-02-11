import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"

interface ContactCardProps {
  method: "email" | "phone" | "chat" | "social"
  title: string
  description?: string
  value: string
  icon?: string
  available?: boolean
  hours?: string
  locale?: string
}

const methodIcons: Record<string, string> = {
  email: "✉️",
  phone: "📞",
  chat: "💬",
  social: "🌐",
}

export function ContactCard({
  method,
  title,
  description,
  value,
  icon,
  available = true,
  hours,
  locale: localeProp,
}: ContactCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  const getHref = () => {
    if (method === "email") return `mailto:${value}`
    if (method === "phone") return `tel:${value}`
    return value
  }

  return (
    <a
      href={getHref()}
      target={method === "social" || method === "chat" ? "_blank" : undefined}
      rel={method === "social" || method === "chat" ? "noopener noreferrer" : undefined}
      className={`flex items-start gap-4 p-4 bg-ds-background rounded-lg border border-ds-border hover:border-ds-primary transition-colors ${
        !available ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <span className="text-2xl flex-shrink-0">{icon || methodIcons[method]}</span>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-ds-foreground">{title}</h4>
        {description && (
          <p className="text-xs text-ds-muted-foreground mt-0.5">{description}</p>
        )}
        <p className="text-sm text-ds-primary mt-1">{value}</p>
        {hours && (
          <p className="text-xs text-ds-muted-foreground mt-1">{hours}</p>
        )}
        {!available && (
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-ds-muted text-ds-muted-foreground rounded">
            {t(locale, "faq.unavailable")}
          </span>
        )}
      </div>
    </a>
  )
}
