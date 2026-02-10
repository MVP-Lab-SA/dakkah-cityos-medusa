import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useBlogPosts } from "@/lib/hooks/use-content"
import { BlogPostCard } from "@/components/content/blog-post-card"
import { t } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/blog/")({
  component: BlogListingPage,
})

const mockCategories = [
  { name: "Technology", slug: "technology", count: 12 },
  { name: "Business", slug: "business", count: 8 },
  { name: "Lifestyle", slug: "lifestyle", count: 6 },
  { name: "City Updates", slug: "city-updates", count: 15 },
  { name: "Commerce", slug: "commerce", count: 10 },
]

function BlogListingPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()

  const { data: posts, isLoading } = useBlogPosts({
    category: selectedCategory,
  })

  const featuredPost = posts?.[0]
  const remainingPosts = posts?.slice(1) || []

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="bg-ds-background border-b border-ds-border">
        <div className="content-container py-8">
          <h1 className="text-3xl font-bold text-ds-foreground">
            {t(locale, "content.blog")}
          </h1>
        </div>
      </div>

      <div className="content-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-6">
                <div className="h-64 bg-ds-background rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-72 bg-ds-background rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ) : !posts?.length ? (
              <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
                <span className="text-4xl mb-4 block">📝</span>
                <p className="text-ds-muted-foreground">
                  {t(locale, "common.not_found")}
                </p>
              </div>
            ) : (
              <>
                {featuredPost && (
                  <div className="mb-8">
                    <BlogPostCard post={featuredPost} variant="featured" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setSelectedCategory(undefined)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      !selectedCategory
                        ? "bg-ds-primary text-ds-primary-foreground"
                        : "bg-ds-background text-ds-muted-foreground border border-ds-border hover:bg-ds-muted"
                    }`}
                  >
                    {t(locale, "blocks.all_categories")}
                  </button>
                  {mockCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                        selectedCategory === cat.slug
                          ? "bg-ds-primary text-ds-primary-foreground"
                          : "bg-ds-background text-ds-muted-foreground border border-ds-border hover:bg-ds-muted"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {remainingPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            )}
          </main>

          <aside className="lg:w-72 flex-shrink-0 space-y-6">
            <div className="bg-ds-background rounded-lg border border-ds-border p-4">
              <h3 className="text-sm font-semibold text-ds-foreground mb-3">
                {t(locale, "nav.categories")}
              </h3>
              <div className="space-y-2">
                {mockCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className="flex items-center justify-between w-full text-start text-sm text-ds-muted-foreground hover:text-ds-foreground transition-colors py-1"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs bg-ds-muted px-2 py-0.5 rounded-full">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {posts && posts.length > 0 && (
              <div className="bg-ds-background rounded-lg border border-ds-border p-4">
                <h3 className="text-sm font-semibold text-ds-foreground mb-3">
                  {t(locale, "content.related_articles")}
                </h3>
                <div className="space-y-4">
                  {posts.slice(0, 4).map((post) => (
                    <BlogPostCard key={post.id} post={post} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
