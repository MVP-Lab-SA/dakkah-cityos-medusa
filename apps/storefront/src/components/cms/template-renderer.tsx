import React, { useState, useEffect } from "react"
import { useLocation } from "@tanstack/react-router"
import type { CMSPage } from "@/lib/types/cityos"
import { DynamicPage } from "@/components/pages/dynamic-page"
import { sdk } from "@/lib/utils/sdk"

interface TemplateRendererProps {
  page: CMSPage
  tenant: { id: string; slug: string; name: string }
  locale: string
  branding?: any
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ page, tenant, locale, branding }) => {
  switch (page.template) {
    case "vertical-list":
      return <VerticalListTemplate page={page} tenant={tenant} locale={locale} />
    case "vertical-detail":
      return <VerticalDetailTemplate page={page} tenant={tenant} locale={locale} />
    case "landing":
    case "home":
      return <DynamicPage page={page} branding={branding} locale={locale} />
    case "static":
      return <StaticTemplate page={page} branding={branding} locale={locale} />
    case "category":
      return <CategoryTemplate page={page} tenant={tenant} locale={locale} />
    case "node-browser":
      return <NodeBrowserTemplate page={page} tenant={tenant} locale={locale} />
    case "custom":
    default:
      return <DynamicPage page={page} branding={branding} locale={locale} />
  }
}

function VerticalListTemplate({ page, tenant, locale }: { page: CMSPage; tenant: { id: string; slug: string }; locale: string }) {
  const config = page.verticalConfig
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!config?.medusaEndpoint) {
      setIsLoading(false)
      return
    }
    sdk.client.fetch(config.medusaEndpoint, { method: "GET" })
      .then((data: any) => {
        const dataItems = data.items || data[config.verticalSlug] || Object.values(data).find(v => Array.isArray(v)) || []
        setItems(Array.isArray(dataItems) ? dataItems : [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [config?.medusaEndpoint, config?.verticalSlug])

  const filteredItems = searchQuery
    ? items.filter((item: any) =>
        Object.values(item).some((val) =>
          typeof val === "string" && val.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : items

  return (
    <div className="min-h-screen bg-ds-muted">
      {page.layout && page.layout.length > 0 ? (
        <DynamicPage page={{ ...page, layout: page.layout.filter((b: any) => b.blockType === "hero") }} locale={locale} />
      ) : (
        <section className="bg-ds-primary text-ds-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-3">{page.title}</h1>
            {page.seo?.description && (
              <p className="text-ds-muted-foreground text-lg max-w-2xl">{page.seo.description}</p>
            )}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Search ${page.title?.toLowerCase() || "items"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-ds-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ds-ring"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-ds-border border-t-zinc-900 rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ds-muted-foreground text-lg">No items found</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            config?.cardLayout === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}>
            {filteredItems.map((item: any, idx: number) => (
              <VerticalCard
                key={item.id || idx}
                item={item}
                verticalSlug={config?.verticalSlug || ""}
                tenant={tenant}
                locale={locale}
                cardLayout={config?.cardLayout}
              />
            ))}
          </div>
        )}
      </div>

      {page.layout && page.layout.filter((b: any) => b.blockType !== "hero").length > 0 && (
        <DynamicPage page={{ ...page, layout: page.layout.filter((b: any) => b.blockType !== "hero") }} locale={locale} />
      )}
    </div>
  )
}

function VerticalCard({ item, verticalSlug, tenant, locale, cardLayout }: {
  item: any; verticalSlug: string; tenant: { slug: string }; locale: string; cardLayout?: string
}) {
  const title = item.name || item.title || "Untitled"
  const description = item.description || item.summary || item.bio || ""
  const image = item.image?.url || item.thumbnail || item.coverImage?.url || item.photo || null
  const price = item.price || item.rate || item.cost || null
  const rating = item.rating || item.stars || null
  const category = item.category || item.type || item.specialty || null
  const detailUrl = `/${tenant.slug}/${locale}/${verticalSlug}/${item.id}`

  if (cardLayout === "list") {
    return (
      <a href={detailUrl} className="flex bg-ds-background rounded-lg shadow-sm border border-ds-border overflow-hidden hover:shadow-md transition-shadow">
        {image && (
          <div className="w-48 h-36 flex-shrink-0">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-lg text-ds-foreground">{title}</h3>
          {category && <span className="text-xs bg-ds-muted text-ds-muted-foreground px-2 py-0.5 rounded mt-1 inline-block">{category}</span>}
          {description && <p className="text-ds-muted-foreground text-sm mt-2 line-clamp-2">{description}</p>}
          <div className="flex items-center gap-3 mt-2">
            {rating && <span className="text-ds-warning text-sm">{"★".repeat(Math.round(Number(rating)))}</span>}
            {price && <span className="text-ds-foreground font-medium">{typeof price === "number" ? `$${price}` : price}</span>}
          </div>
        </div>
      </a>
    )
  }

  return (
    <a href={detailUrl} className="bg-ds-background rounded-lg shadow-sm border border-ds-border overflow-hidden hover:shadow-md transition-shadow">
      {image && (
        <div className="aspect-video">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-ds-foreground">{title}</h3>
        {category && <span className="text-xs bg-ds-muted text-ds-muted-foreground px-2 py-0.5 rounded mt-1 inline-block">{category}</span>}
        {description && <p className="text-ds-muted-foreground text-sm mt-2 line-clamp-3">{description}</p>}
        <div className="flex items-center justify-between mt-3">
          {rating && <span className="text-ds-warning text-sm">{"★".repeat(Math.round(Number(rating)))}</span>}
          {price && <span className="text-ds-foreground font-semibold">{typeof price === "number" ? `$${price}` : price}</span>}
        </div>
      </div>
    </a>
  )
}

function VerticalDetailTemplate({ page, tenant, locale }: { page: CMSPage; tenant: { id: string; slug: string }; locale: string }) {
  const config = page.verticalConfig
  const [item, setItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const routerLocation = useLocation()
  const itemId = routerLocation.pathname.split("/").pop() || ""

  useEffect(() => {
    if (!config?.medusaEndpoint || !itemId) {
      setIsLoading(false)
      return
    }
    sdk.client.fetch(`${config.medusaEndpoint}/${itemId}`, { method: "GET" })
      .then((data: any) => {
        const resolved = data.item || data[config.verticalSlug?.replace(/-/g, "_")] || data
        setItem(resolved)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [config?.medusaEndpoint, itemId, config?.verticalSlug])

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-ds-border border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-ds-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ds-foreground mb-2">Not Found</h1>
          <p className="text-ds-muted-foreground">The requested item could not be found.</p>
          <a href={`/${tenant.slug}/${locale}`} className="mt-4 inline-block text-ds-foreground underline">Go back</a>
        </div>
      </div>
    )
  }

  const title = item.name || item.title || "Untitled"
  const description = item.description || item.bio || item.summary || ""
  const image = item.image?.url || item.thumbnail || item.coverImage?.url || item.photo || null
  const price = item.price || item.rate || item.cost || null
  const rating = item.rating || item.stars || null
  const category = item.category || item.type || item.specialty || null
  const location = item.location || item.address || null
  const contact = item.contact || item.phone || item.email || null

  const extraFields = Object.entries(item).filter(([key]) =>
    !["id", "name", "title", "description", "bio", "summary", "image", "thumbnail", "coverImage", "photo",
      "price", "rate", "cost", "rating", "stars", "category", "type", "specialty", "location", "address",
      "contact", "phone", "email", "created_at", "updated_at", "metadata", "tenant_id", "status"].includes(key)
  )

  return (
    <div className="min-h-screen bg-ds-muted">
      <div className="bg-ds-primary text-ds-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-ds-muted-foreground mb-4">
            <a href={`/${tenant.slug}/${locale}`} className="hover:text-ds-primary-foreground">Home</a>
            <span className="mx-2">/</span>
            {config?.verticalSlug && (
              <>
                <a href={`/${tenant.slug}/${locale}/${config.verticalSlug}`} className="hover:text-ds-primary-foreground capitalize">
                  {config.verticalSlug.replace(/-/g, " ")}
                </a>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-ds-primary-foreground">{title}</span>
          </nav>
          <h1 className="text-3xl font-bold">{title}</h1>
          {category && <span className="inline-block bg-ds-background/10 px-3 py-1 rounded text-sm mt-2">{category}</span>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {image && (
              <div className="rounded-lg overflow-hidden mb-6">
                <img src={image} alt={title} className="w-full h-auto max-h-96 object-cover" />
              </div>
            )}

            {description && (
              <div className="bg-ds-background rounded-lg p-6 shadow-sm border border-ds-border mb-6">
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-ds-foreground whitespace-pre-line">{description}</p>
              </div>
            )}

            {extraFields.length > 0 && (
              <div className="bg-ds-background rounded-lg p-6 shadow-sm border border-ds-border mb-6">
                <h2 className="text-xl font-semibold mb-3">Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extraFields.map(([key, value]) => {
                    if (typeof value === "object" || value === null || value === undefined) return null
                    return (
                      <div key={key}>
                        <dt className="text-sm text-ds-muted-foreground capitalize">{key.replace(/_/g, " ")}</dt>
                        <dd className="text-ds-foreground font-medium">{String(value)}</dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {(price || rating || location || contact) && (
              <div className="bg-ds-background rounded-lg p-6 shadow-sm border border-ds-border">
                <h3 className="font-semibold text-lg mb-4">Quick Info</h3>
                {price && (
                  <div className="mb-3">
                    <span className="text-sm text-ds-muted-foreground">Price</span>
                    <p className="text-2xl font-bold text-ds-foreground">{typeof price === "number" ? `$${price}` : price}</p>
                  </div>
                )}
                {rating && (
                  <div className="mb-3">
                    <span className="text-sm text-ds-muted-foreground">Rating</span>
                    <p className="text-ds-warning text-lg">{"★".repeat(Math.round(Number(rating)))}{"☆".repeat(5 - Math.round(Number(rating)))}</p>
                  </div>
                )}
                {location && (
                  <div className="mb-3">
                    <span className="text-sm text-ds-muted-foreground">Location</span>
                    <p className="text-ds-foreground">{typeof location === "object" ? (location as any).address || JSON.stringify(location) : location}</p>
                  </div>
                )}
                {contact && (
                  <div className="mb-3">
                    <span className="text-sm text-ds-muted-foreground">Contact</span>
                    <p className="text-ds-foreground">{typeof contact === "object" ? (contact as any).phone || (contact as any).email || JSON.stringify(contact) : contact}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {page.layout && page.layout.length > 0 && (
        <DynamicPage page={page} locale={locale} />
      )}
    </div>
  )
}

function StaticTemplate({ page, branding, locale }: { page: CMSPage; branding?: any; locale?: string }) {
  return (
    <div className="min-h-screen bg-ds-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-ds-foreground mb-4">{page.title}</h1>
        {page.seo?.description && (
          <p className="text-lg text-ds-muted-foreground mb-8">{page.seo.description}</p>
        )}
      </div>
      {page.layout && page.layout.length > 0 ? (
        <DynamicPage page={page} branding={branding} locale={locale} />
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <p className="text-ds-muted-foreground">This page has no content yet.</p>
        </div>
      )}
    </div>
  )
}

function CategoryTemplate({ page, tenant, locale }: { page: CMSPage; tenant: { id: string; slug: string }; locale: string }) {
  return (
    <div className="min-h-screen bg-ds-muted">
      <section className="bg-ds-primary text-ds-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">{page.title}</h1>
          {page.seo?.description && (
            <p className="text-ds-muted-foreground text-lg max-w-2xl">{page.seo.description}</p>
          )}
        </div>
      </section>
      {page.layout && page.layout.length > 0 && (
        <DynamicPage page={page} locale={locale} />
      )}
    </div>
  )
}

function NodeBrowserTemplate({ page, tenant, locale }: { page: CMSPage; tenant: { id: string; slug: string }; locale: string }) {
  return (
    <div className="min-h-screen bg-ds-muted">
      <section className="bg-ds-primary text-ds-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">{page.title || "City Hierarchy"}</h1>
          <p className="text-ds-muted-foreground text-lg max-w-2xl">
            Browse the organizational structure from city level down to individual assets.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {page.layout && page.layout.length > 0 ? (
          <DynamicPage page={page} locale={locale} />
        ) : (
          <p className="text-ds-muted-foreground">Node hierarchy browser will load from platform context.</p>
        )}
      </div>
    </div>
  )
}

export default TemplateRenderer
