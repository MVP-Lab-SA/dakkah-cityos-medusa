import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, lazy, Suspense } from 'react'
import { TemplateRenderer } from '@/components/cms/template-renderer'
import type { CMSPage } from '@/lib/types/cityos'

const Store = lazy(() => import('@/pages/store'))

const DEFAULT_TENANT_ID = "01KGZ2JRYX607FWMMYQNQRKVWS"

const TENANT_SLUG_TO_ID: Record<string, string> = {
  dakkah: DEFAULT_TENANT_ID,
}

const BUILT_IN_ROUTES = new Set(["store"])

async function resolvePageFromServer(tenantId: string, path: string, locale?: string): Promise<CMSPage | null> {
  try {
    const baseUrl = typeof window === "undefined" ? "http://localhost:9000" : ""
    const params = new URLSearchParams({ path, tenant_id: tenantId })
    if (locale) params.set("locale", locale)
    const response = await fetch(`${baseUrl}/platform/cms/resolve?${params}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.payload?.docs?.[0] || data.data?.page || null
  } catch {
    return null
  }
}

export const Route = createFileRoute('/$tenant/$locale/$slug')({
  loader: async ({ params }) => {
    const { slug, locale, tenant } = params
    if (BUILT_IN_ROUTES.has(slug)) {
      return { page: null, tenantSlug: tenant, locale, slug, isBuiltIn: true }
    }
    const tenantId = TENANT_SLUG_TO_ID[tenant] || DEFAULT_TENANT_ID
    let page: CMSPage | null = null
    try {
      page = await resolvePageFromServer(tenantId, slug, locale)
    } catch {}
    return { page, tenantSlug: tenant, locale, slug, isBuiltIn: false }
  },
  component: CMSSlugPageComponent,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.isBuiltIn && loaderData?.slug === 'store' ? 'Store | Dakkah CityOS' : (loaderData?.page?.seo?.title || loaderData?.page?.title || 'Page') },
      { name: 'description', content: loaderData?.page?.seo?.description || '' },
    ],
  }),
})

function CMSSlugPageComponent() {
  const data = Route.useLoaderData()
  const { tenant, locale, slug } = Route.useParams()

  if (data?.isBuiltIn && slug === "store") {
    return (
      <Suspense fallback={<div className="content-container py-6"><div className="text-zinc-600">Loading store...</div></div>}>
        <Store />
      </Suspense>
    )
  }

  return <CMSPageResolver data={data} tenant={tenant} locale={locale} slug={slug} />
}

function CMSPageResolver({ data, tenant, locale, slug }: { data: any; tenant: string; locale: string; slug: string }) {
  const tenantId = TENANT_SLUG_TO_ID[tenant] || DEFAULT_TENANT_ID

  const [page, setPage] = useState<CMSPage | null>(data?.page || null)
  const [isLoading, setIsLoading] = useState(!data?.page)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (page || typeof window === "undefined") return

    const params = new URLSearchParams({ path: slug, tenant_id: tenantId })
    if (locale) params.set("locale", locale)

    fetch(`/platform/cms/resolve?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((d) => {
        setPage(d.payload?.docs?.[0] || d.data?.page || null)
        setIsLoading(false)
      })
      .catch(() => {
        setHasError(true)
        setIsLoading(false)
      })
  }, [slug, tenantId, locale, page])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!page || hasError) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Page Not Found</h1>
          <p className="text-zinc-600 mb-6">The page you're looking for doesn't exist or hasn't been published yet.</p>
          <a href={`/${tenant}/${locale}`} className="text-zinc-900 underline hover:no-underline">Return home</a>
        </div>
      </div>
    )
  }

  const tenantObj = {
    id: typeof page.tenant === "string" ? page.tenant : page.tenant?.id || "",
    slug: tenant,
    name: typeof page.tenant === "object" ? page.tenant?.name || tenant : tenant,
  }

  return <TemplateRenderer page={page} tenant={tenantObj} locale={locale} />
}
