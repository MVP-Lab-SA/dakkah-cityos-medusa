import { createFileRoute, notFound, Outlet } from "@tanstack/react-router"

const SUPPORTED_LOCALES = ["en", "fr", "ar"]

export const Route = createFileRoute("/$tenant/$locale")({
  loader: async ({ params, context }) => {
    const { tenant, locale } = params
    const { queryClient } = context

    if (!SUPPORTED_LOCALES.includes(locale)) {
      throw notFound()
    }

    let tenantData = null
    try {
      const response = await fetch(`/store/cityos/tenant?slug=${encodeURIComponent(tenant)}`)
      if (response.ok) {
        const data = await response.json()
        tenantData = data.tenant
      }
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
  const { locale, direction } = Route.useLoaderData()

  return (
    <div dir={direction} lang={locale}>
      <Outlet />
    </div>
  )
}
