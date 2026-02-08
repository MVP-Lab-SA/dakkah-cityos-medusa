import { createFileRoute, notFound } from '@tanstack/react-router'
import { queryKeys } from '@/lib/utils/query-keys'
import { DynamicPage } from '@/components/pages/dynamic-page'
import { getUnifiedClient } from '@/lib/api/unified-client'

export const Route = createFileRoute('/$tenant/$locale/$slug')({
  loader: async ({ params, context }) => {
    const { slug, locale } = params

    // Load page data from Payload CMS
    const page = await context.queryClient.ensureQueryData({
      queryKey: queryKeys.pages.bySlug(slug),
      queryFn: async () => {
        const client = getUnifiedClient()
        const page = await client.getPayloadPage(slug)

        if (!page) {
          throw notFound()
        }

        return page
      },
    })

    // Get tenant/store branding if page is associated with a tenant
    let tenantBranding = null
    if (page.tenant) {
      tenantBranding = await context.queryClient.ensureQueryData({
        queryKey: queryKeys.tenants.detail(
          typeof page.tenant === 'string' ? page.tenant : page.tenant.id
        ),
        queryFn: async () => {
          const client = getUnifiedClient()
          const tenantId = typeof page.tenant === 'string' ? page.tenant : page.tenant.id
          const stores = await client.getStores()
          return stores.find(s => s.id === tenantId) || null
        },
      })
    }

    return { page, tenantBranding, countryCode: locale }
  },
  component: DynamicPageComponent,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.page?.meta?.title || loaderData?.page?.title || 'Page',
      },
      {
        name: 'description',
        content:
          loaderData?.page?.meta?.description ||
          loaderData?.page?.description ||
          '',
      },
      // Open Graph
      {
        property: 'og:title',
        content: loaderData?.page?.meta?.title || loaderData?.page?.title || 'Page',
      },
      {
        property: 'og:description',
        content:
          loaderData?.page?.meta?.description ||
          loaderData?.page?.description ||
          '',
      },
      {
        property: 'og:image',
        content:
          loaderData?.page?.meta?.image?.url ||
          loaderData?.tenantBranding?.logo?.url ||
          '',
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: loaderData?.page?.meta?.title || loaderData?.page?.title || 'Page',
      },
      {
        name: 'twitter:description',
        content:
          loaderData?.page?.meta?.description ||
          loaderData?.page?.description ||
          '',
      },
    ],
  }),
})

function DynamicPageComponent() {
  const { page, tenantBranding } = Route.useLoaderData()

  return <DynamicPage page={page} branding={tenantBranding} />
}
