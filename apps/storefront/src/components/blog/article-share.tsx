import { useState } from "react"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"

interface ArticleShareProps {
  url: string
  title: string
  description?: string
  locale?: string
}

export function ArticleShare({ url, title, description, locale: localeProp }: ArticleShareProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard not available */
    }
  }

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-ds-foreground">
        {t(locale, "blog.share")}:
      </span>
      <button
        onClick={handleCopyLink}
        className="px-3 py-1.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded hover:bg-ds-background transition-colors"
      >
        {copied ? t(locale, "blocks.copied") : t(locale, "blog.copy_link")}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded hover:bg-ds-background transition-colors"
      >
        Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded hover:bg-ds-background transition-colors"
      >
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded hover:bg-ds-background transition-colors"
      >
        LinkedIn
      </a>
    </div>
  )
}
