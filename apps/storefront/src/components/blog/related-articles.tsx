import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import type { BlogPost } from "@/lib/hooks/use-content"
import { ArticleCard } from "./article-card"

interface RelatedArticlesProps {
  articles: BlogPost[]
  maxItems?: number
  locale?: string
}

export function RelatedArticles({ articles, maxItems = 4, locale: localeProp }: RelatedArticlesProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"

  if (!articles.length) return null

  const displayed = articles.slice(0, maxItems)

  return (
    <div>
      <h2 className="text-xl font-semibold text-ds-foreground mb-4">
        {t(locale, "blog.related_articles")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map((post) => (
          <ArticleCard key={post.id} post={post} locale={locale} />
        ))}
      </div>
    </div>
  )
}
