import { useState } from "react"
import { useTenant } from "@/lib/context/tenant-context"
import { t } from "@/lib/i18n"
import type { BlogPost } from "@/lib/hooks/use-content"
import { ArticleCard } from "./article-card"

interface ArticleSidebarProps {
  categories?: { name: string; slug: string; count: number }[]
  popularPosts?: BlogPost[]
  tags?: { name: string; count: number }[]
  showNewsletter?: boolean
  selectedCategory?: string
  onCategorySelect?: (slug: string) => void
  onTagSelect?: (tag: string) => void
  locale?: string
}

export function ArticleSidebar({
  categories,
  popularPosts,
  tags,
  showNewsletter = true,
  selectedCategory,
  onCategorySelect,
  onTagSelect,
  locale: localeProp,
}: ArticleSidebarProps) {
  const { locale: ctxLocale } = useTenant()
  const locale = localeProp || ctxLocale || "en"
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <aside className="lg:w-72 flex-shrink-0 space-y-6">
      {categories && categories.length > 0 && (
        <div className="bg-ds-background rounded-lg border border-ds-border p-4">
          <h3 className="text-sm font-semibold text-ds-foreground mb-3">
            {t(locale, "nav.categories")}
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => onCategorySelect?.(cat.slug)}
                className={`flex items-center justify-between w-full text-start text-sm transition-colors py-1 ${
                  selectedCategory === cat.slug
                    ? "text-ds-primary font-medium"
                    : "text-ds-muted-foreground hover:text-ds-foreground"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs bg-ds-muted px-2 py-0.5 rounded-full">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {popularPosts && popularPosts.length > 0 && (
        <div className="bg-ds-background rounded-lg border border-ds-border p-4">
          <h3 className="text-sm font-semibold text-ds-foreground mb-3">
            {t(locale, "blog.popular_posts")}
          </h3>
          <div className="space-y-4">
            {popularPosts.slice(0, 4).map((post) => (
              <ArticleCard key={post.id} post={post} variant="compact" locale={locale} />
            ))}
          </div>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="bg-ds-background rounded-lg border border-ds-border p-4">
          <h3 className="text-sm font-semibold text-ds-foreground mb-3">
            {t(locale, "blog.tags")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => onTagSelect?.(tag.name)}
                className="px-2.5 py-1 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded-full hover:bg-ds-primary hover:text-ds-primary-foreground transition-colors"
              >
                #{tag.name} ({tag.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {showNewsletter && (
        <div className="bg-ds-primary rounded-lg p-4 text-ds-primary-foreground">
          <h3 className="text-sm font-semibold mb-2">
            {t(locale, "blog.newsletter_title")}
          </h3>
          <p className="text-xs opacity-80 mb-3">
            {t(locale, "blog.newsletter_description")}
          </p>
          {subscribed ? (
            <p className="text-sm font-medium">{t(locale, "blocks.subscribe_success")}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t(locale, "blocks.subscribe_placeholder")}
                className="w-full px-3 py-2 text-sm rounded bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
                required
              />
              <button
                type="submit"
                className="w-full px-3 py-2 text-sm font-medium bg-ds-background text-ds-foreground rounded hover:bg-ds-muted transition-colors"
              >
                {t(locale, "blocks.subscribe")}
              </button>
            </form>
          )}
        </div>
      )}
    </aside>
  )
}
