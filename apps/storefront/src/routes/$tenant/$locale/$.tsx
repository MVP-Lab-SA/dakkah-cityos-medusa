import { createFileRoute, notFound } from "@tanstack/react-router"
import { queryKeys } from "@/lib/utils/query-keys"
import { TemplateRenderer } from "@/components/cms/template-renderer"
import type { CMSPage } from "@/lib/types/cityos"

const DEFAULT_TENANT_ID = "01KGZ2JRYX607FWMMYQNQRKVWS"

const TENANT_SLUG_TO_ID: Record<string, string> = {
  dakkah: DEFAULT_TENANT_ID,
}

export const Route = createFileRoute("/$tenant/$locale/$")({
  loader: async ({ params, context }) => {
    const splatPath = params._splat || ""
    const { tenant, locale } = params

    if (typeof window === "undefined") {
      return { page: null, tenantSlug: tenant, locale, splatPath }
    }

    const tenantId = TENANT_SLUG_TO_ID[tenant] || DEFAULT_TENANT_ID

    let page: CMSPage | null = null
    try {
      const { fetchCMSPage } = await import("@/lib/hooks/use-cms")
      page = await fetchCMSPage(tenantId, splatPath, locale)
    } catch (error) {
      console.warn(`CMS page resolution failed for "${splatPath}":`, error)
    }

    if (!page) {
      throw notFound()
    }

    return { page, tenantSlug: tenant, locale, splatPath }
  },
  component: CMSPageComponent,
  notFoundComponent: () => {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Page Not Found</h1>
          <p className="text-zinc-600 mb-6">The page you're looking for doesn't exist or hasn't been published yet.</p>
          <a href="/" className="text-zinc-900 underline hover:no-underline">Return home</a>
        </div>
      </div>
    )
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.page?.seo?.title || loaderData?.page?.title || "Page" },
      { name: "description", content: loaderData?.page?.seo?.description || "" },
      { property: "og:title", content: loaderData?.page?.seo?.title || loaderData?.page?.title || "Page" },
      { property: "og:description", content: loaderData?.page?.seo?.description || "" },
      { property: "og:image", content: loaderData?.page?.seo?.ogImage?.url || "" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: loaderData?.page?.seo?.title || loaderData?.page?.title || "Page" },
      { name: "twitter:description", content: loaderData?.page?.seo?.description || "" },
    ],
  }),
})

function CMSPageComponent() {
  const data = Route.useLoaderData()

  if (!data?.page) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Loading page...</p>
        </div>
      </div>
    )
  }

  const tenantObj = {
    id: typeof data.page.tenant === "string" ? data.page.tenant : data.page.tenant?.id || "",
    slug: data.tenantSlug,
    name: typeof data.page.tenant === "object" ? data.page.tenant?.name || data.tenantSlug : data.tenantSlug,
  }

  return <TemplateRenderer page={data.page} tenant={tenantObj} locale={data.locale} />
}
