import { createFileRoute, notFound } from '@tanstack/react-router'
import { queryKeys } from '~/lib/utils/query-keys'
import { DynamicPage } from '~/components/pages/dynamic-page'
import { unifiedClient } from '~/lib/api/unified-client'

export const Route = createFileRoute('/$countryCode/$slug')({
  loader: async ({ params, context }) => {
    const { slug, countryCode } = params

    // Load page data from Payload CMS
    const page = await context.queryClient.ensureQueryData({
      queryKey: queryKeys.pages.bySlug(slug),
      queryFn: async () => {
        const pages = await unifiedClient.payload.getPages({
          where: {
            slug: {
              equals: slug,
            },
            status: {
              equals: 'published',
            },
          },
          limit: 1,
        })

        if (!pages?.docs?.[0]) {
          throw notFound()
        }

        return pages.docs[0]
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
          return unifiedClient.payload.getStore(
            typeof page.tenant === 'string' ? page.tenant : page.tenant.id
          )
        },
      })
    }

    return { page, tenantBranding, countryCode }
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
