import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"
import { TenantProvider } from "@/lib/context/tenant-context"
import { sdk } from "@/lib/utils/sdk"

const SUPPORTED_LOCALES = ["en", "fr", "ar"]

export const Route = createFileRoute("/$tenant/$locale")({
  loader: async ({ params, context }) => {
    const { tenant, locale } = params
    const { queryClient } = context

    if (!SUPPORTED_LOCALES.includes(locale)) {
      throw notFound()
    }

    if (typeof window === "undefined") {
      return {
        tenant: null,
        tenantSlug: tenant,
        locale,
        direction: locale === "ar" ? "rtl" : "ltr",
        regions: null,
      }
    }

    let tenantData = null
    try {
      const response = await sdk.client.fetch<{ tenant: any }>(`/store/cityos/tenant?slug=${encodeURIComponent(tenant)}`)
      tenantData = response.tenant
    } catch (e) {
      console.warn("Tenant resolution failed, using default context")
    }

    const regions = await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: async () => {
        const { listRegions } = await import("@/lib/data/regions")
        return listRegions({ fields: "currency_code, *countries" })
      },
    })

    return {
      tenant: tenantData,
      tenantSlug: tenant,
      locale,
      direction: locale === "ar" ? "rtl" : "ltr",
      regions,
    }
  },
  component: TenantLocaleLayout,
})

function TenantLocaleLayout() {
  const { tenant, tenantSlug, locale, direction } = Route.useLoaderData()

  return (
    <div dir={direction} lang={locale}>
      <TenantProvider value={{ tenant, tenantSlug, locale, direction }}>
        <Outlet />
      </TenantProvider>
    </div>
  )
}
