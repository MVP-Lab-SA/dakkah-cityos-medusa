import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useHelpCategories } from "@/lib/hooks/use-content"
import { FAQSearch } from "@/components/help/faq-search"
import { FAQCategoryCard } from "@/components/help/faq-category-card"
import { ContactCard } from "@/components/help/contact-card"
import { SupportTicketForm } from "@/components/help/support-ticket-form"
import { t } from "@/lib/i18n"
import { Link } from "@tanstack/react-router"

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
      <div className="content-container py-8 space-y-8">
        <FAQSearch
          onSearch={setSearchQuery}
          value={searchQuery}
          locale={locale}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-ds-background rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !data?.categories?.length ? (
          <div className="bg-ds-background rounded-lg border border-ds-border p-12 text-center">
            <span className="text-4xl block mb-4">📚</span>
            <p className="text-ds-muted-foreground">{t(locale, "common.not_found")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <FAQCategoryCard
                  key={category.id}
                  id={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  articleCount={category.articleCount}
                  slug={category.slug}
                  locale={locale}
                />
              ))}
            </div>

            {filteredArticles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-ds-foreground mb-4">
                  {t(locale, "blocks.featured")}
                </h3>
                <div className="space-y-3">
                  {filteredArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`${prefix}/help/${article.slug}` as any}
                      className="flex items-center justify-between p-4 bg-ds-background rounded-lg border border-ds-border hover:border-ds-primary transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-ds-foreground">
                          {article.title}
                        </h4>
                        {article.excerpt && (
                          <p className="text-xs text-ds-muted-foreground mt-1 line-clamp-1">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-ds-muted-foreground ms-4 flex-shrink-0">
                        {article.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ContactCard
                method="email"
                title={t(locale, "faq.contact_email")}
                description={t(locale, "faq.contact_email_desc")}
                value="support@dakkah.com"
                locale={locale}
              />
              <ContactCard
                method="phone"
                title={t(locale, "faq.contact_phone")}
                description={t(locale, "faq.contact_phone_desc")}
                value="+966 11 000 0000"
                locale={locale}
              />
              <ContactCard
                method="chat"
                title={t(locale, "faq.contact_chat")}
                description={t(locale, "faq.contact_chat_desc")}
                value="#"
                locale={locale}
              />
              <ContactCard
                method="social"
                title={t(locale, "faq.contact_social")}
                description={t(locale, "faq.contact_social_desc")}
                value="https://twitter.com/dakkah"
                locale={locale}
              />
            </div>

            <SupportTicketForm locale={locale} />
          </>
        )}
      </div>
    </div>
  )
}
