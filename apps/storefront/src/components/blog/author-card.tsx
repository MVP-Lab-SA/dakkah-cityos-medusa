import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"

interface AuthorCardProps {
  name: string
  avatar?: string
  bio?: string
  socialLinks?: Record<string, string>
  articleCount?: number
  variant?: "inline" | "full"
  locale?: string
}

export function AuthorCard({
  name,
  avatar,
  bio,
  socialLinks,
  articleCount,
  variant = "inline",
  locale: localeProp,
}: AuthorCardProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        {avatar && (
          <img loading="lazy" src={avatar} alt={name} className="w-8 h-8 rounded-full" />
        )}
        <div>
          <span className="text-sm font-medium text-ds-foreground">{name}</span>
          {articleCount !== undefined && (
            <span className="text-xs text-ds-muted-foreground ms-2">
              {articleCount} {t(locale, "blog.articles")}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-ds-muted rounded-lg">
      {avatar && (
        <img loading="lazy" src={avatar} alt={name} className="w-12 h-12 rounded-full flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ds-foreground">{name}</p>
        {bio && <p className="text-sm text-ds-muted-foreground mt-1">{bio}</p>}
        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <div className="flex items-center gap-3 mt-2">
            {Object.entries(socialLinks).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-ds-primary hover:underline capitalize"
              >
                {platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
