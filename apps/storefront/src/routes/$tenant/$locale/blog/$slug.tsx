import { createFileRoute, Link } from "@tanstack/react-router"
import { useBlogPost } from "@/lib/hooks/use-content"
import { BlogPostCard } from "@/components/content/blog-post-card"
import { t, formatDate } from "@/lib/i18n"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/blog/$slug")({
  component: BlogPostPage,
})

function BlogPostPage() {
  const { tenant, locale, slug } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const { data: post, isLoading } = useBlogPost(slug)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ds-muted">
        <div className="h-64 bg-ds-background animate-pulse" />
        <div className="content-container py-8 max-w-3xl mx-auto space-y-4">
          <div className="h-8 bg-ds-background rounded animate-pulse w-3/4" />
          <div className="h-4 bg-ds-background rounded animate-pulse w-1/2" />
          <div className="space-y-2 mt-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-ds-background rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4">📄</span>
          <p className="text-ds-muted-foreground mb-4">{t(locale, "common.not_found")}</p>
          <Link
            to={`${prefix}/blog` as any}
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
      {post.thumbnail && (
        <div className="relative h-64 md:h-80 bg-ds-background">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="content-container py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to={`${prefix}/blog` as any}
            className="inline-flex items-center text-sm text-ds-muted-foreground hover:text-ds-foreground mb-4 transition-colors"
          >
            <svg className="h-4 w-4 me-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t(locale, "common.back")}
          </Link>

          <article className="bg-ds-background rounded-lg border border-ds-border p-6 md:p-8">
            {post.category && (
              <span className="inline-block px-3 py-1 text-xs font-medium bg-ds-primary text-ds-primary-foreground rounded-full mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-ds-border text-sm text-ds-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar && (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="font-medium text-ds-foreground">
                    {t(locale, "content.by_author")} {post.author.name}
                  </span>
                </div>
              )}
              <span>{formatDate(post.publishedAt, locale as any)}</span>
              {post.readingTime && (
                <span>{post.readingTime} {t(locale, "content.min_read")}</span>
              )}
            </div>

            <div
              className="prose prose-sm md:prose-base max-w-none text-ds-foreground [&_h2]:text-ds-foreground [&_h3]:text-ds-foreground [&_a]:text-ds-primary [&_blockquote]:border-ds-border [&_blockquote]:text-ds-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-ds-border">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {shareUrl && (
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-ds-border">
                <span className="text-sm font-medium text-ds-foreground">
                  {t(locale, "social.share")}:
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(shareUrl)}
                  className="px-3 py-1.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded hover:bg-ds-background transition-colors"
                >
                  {t(locale, "social.copy_link")}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded hover:bg-ds-background transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded hover:bg-ds-background transition-colors"
                >
                  Facebook
                </a>
              </div>
            )}

            {post.author?.bio && (
              <div className="mt-8 pt-6 border-t border-ds-border">
                <div className="flex items-start gap-4 p-4 bg-ds-muted rounded-lg">
                  {post.author.avatar && (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-ds-foreground">{post.author.name}</p>
                    <p className="text-sm text-ds-muted-foreground mt-1">{post.author.bio}</p>
                  </div>
                </div>
              </div>
            )}
          </article>

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-ds-foreground mb-4">
                {t(locale, "content.related_articles")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.relatedPosts.map((related) => (
                  <BlogPostCard key={related.id} post={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
