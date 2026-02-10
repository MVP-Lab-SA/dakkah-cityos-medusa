import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { useHelpArticle } from "@/lib/hooks/use-content"
import { t, formatDate } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/help/$slug")({
  component: HelpArticlePage,
})

function HelpArticlePage() {
  const { tenant, locale, slug } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const { data: article, isLoading } = useHelpArticle(slug)
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ds-muted">
        <div className="content-container py-8 max-w-3xl mx-auto">
          <div className="h-6 bg-ds-background rounded animate-pulse w-1/3 mb-4" />
          <div className="h-8 bg-ds-background rounded animate-pulse w-2/3 mb-8" />
          <div className="bg-ds-background rounded-lg p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-ds-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4">📄</span>
          <p className="text-ds-muted-foreground mb-4">{t(locale, "common.not_found")}</p>
          <Link
            to={`${prefix}/help` as any}
            className="text-sm text-ds-primary hover:underline"
          >
            {t(locale, "common.back")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="content-container py-8">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-6">
            <Link to={`${prefix}/help` as any} className="hover:text-ds-foreground transition-colors">
              {t(locale, "content.help_center")}
            </Link>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ds-foreground">{article.category}</span>
          </nav>

          <article className="bg-ds-background rounded-lg border border-ds-border p-6 md:p-8">
            <h1 className="text-2xl font-bold text-ds-foreground mb-2">{article.title}</h1>
            {article.updatedAt && (
              <p className="text-sm text-ds-muted-foreground mb-6">
                {formatDate(article.updatedAt, locale as any)}
              </p>
            )}

            <div
              className="prose prose-sm md:prose-base max-w-none text-ds-foreground [&_h2]:text-ds-foreground [&_h3]:text-ds-foreground [&_a]:text-ds-primary [&_ul]:list-disc [&_ol]:list-decimal"
              dangerouslySetInnerHTML={{ __html: article.content || article.excerpt || "" }}
            />

            <div className="mt-8 pt-6 border-t border-ds-border">
              <p className="text-sm font-medium text-ds-foreground mb-3">
                {t(locale, "content.was_helpful")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setFeedback("yes")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    feedback === "yes"
                      ? "bg-ds-success text-white border-ds-success"
                      : "bg-ds-background text-ds-foreground border-ds-border hover:bg-ds-muted"
                  }`}
                >
                  👍 {t(locale, "blocks.yes")}
                </button>
                <button
                  onClick={() => setFeedback("no")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    feedback === "no"
                      ? "bg-ds-destructive text-white border-ds-destructive"
                      : "bg-ds-background text-ds-foreground border-ds-border hover:bg-ds-muted"
                  }`}
                >
                  👎 {t(locale, "blocks.no")}
                </button>
              </div>
              {feedback && (
                <p className="text-sm text-ds-muted-foreground mt-3">
                  {feedback === "yes" ? "Thanks for your feedback!" : "We'll work on improving this article."}
                </p>
              )}
            </div>
          </article>

          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-ds-foreground mb-4">
                {t(locale, "content.related_articles")}
              </h2>
              <div className="space-y-3">
                {article.relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    to={`${prefix}/help/${related.slug}` as any}
                    className="flex items-center justify-between p-4 bg-ds-background rounded-lg border border-ds-border hover:border-ds-primary transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-ds-foreground">{related.title}</h4>
                      {related.excerpt && (
                        <p className="text-xs text-ds-muted-foreground mt-1 line-clamp-1">
                          {related.excerpt}
                        </p>
                      )}
                    </div>
                    <svg className="h-4 w-4 text-ds-muted-foreground flex-shrink-0 ms-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
