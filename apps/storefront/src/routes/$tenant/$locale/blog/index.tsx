import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useBlogPosts } from "@/lib/hooks/use-content"
import { ArticleCard } from "@/components/blog/article-card"
import { ArticleSidebar } from "@/components/blog/article-sidebar"
import { CategoryFilter } from "@/components/blog/category-filter"
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
            {t(locale, "blog.title")}
          </h1>
          <p className="text-ds-muted-foreground mt-1">
            {t(locale, "blog.description")}
          </p>
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
                    <ArticleCard post={featuredPost} variant="featured" locale={locale} />
                  </div>
                )}

                <div className="mb-6">
                  <CategoryFilter
                    categories={mockCategories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                    locale={locale}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {remainingPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} locale={locale} />
                  ))}
                </div>
              </>
            )}
          </main>

          <ArticleSidebar
            categories={mockCategories}
            popularPosts={posts?.slice(0, 4)}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            showNewsletter
            locale={locale}
          />
        </div>
      </div>
    </div>
  )
}
