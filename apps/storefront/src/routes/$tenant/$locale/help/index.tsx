import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useHelpCategories } from "@/lib/hooks/use-content"
import { HelpCenter } from "@/components/content/help-center"
import { t } from "@/lib/i18n"

export const Route = createFileRoute("/$tenant/$locale/help/")({
  component: HelpCenterPage,
})

function HelpCenterPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const { data, isLoading } = useHelpCategories()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = data?.categories?.filter((cat) =>
    searchQuery
      ? cat.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || []

  const filteredArticles = data?.featuredArticles?.filter((article) =>
    searchQuery
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  ) || []

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="content-container py-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="h-48 bg-ds-background rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-ds-background rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ) : !data?.categories?.length ? (
          <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
            <span className="text-4xl block mb-4">📚</span>
            <p className="text-ds-muted-foreground">{t(locale, "common.not_found")}</p>
          </div>
        ) : (
          <HelpCenter
            categories={filteredCategories}
            featuredArticles={filteredArticles}
            onSearch={setSearchQuery}
          />
        )}
      </div>
    </div>
  )
}
