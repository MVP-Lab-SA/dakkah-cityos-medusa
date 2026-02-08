import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router"
import { listRegions } from "@/lib/data/regions"

export const Route = createFileRoute("/$countryCode")({
  beforeLoad: async ({ params, location }) => {
    const { countryCode } = params

    const supportedLocales = ["en", "fr", "ar"]
    if (supportedLocales.includes(countryCode)) {
      return
    }

    const remainingPath = location.pathname.replace(`/${countryCode}`, "") || "/"

    throw redirect({
      to: `/$tenant/$locale${remainingPath}` as any,
      params: { tenant: "default", locale: "en" },
    })
  },
  loader: async ({ params, context }) => {
    const { countryCode } = params
    const { queryClient } = context

    const regions = await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions({ fields: "currency_code, *countries" }),
    })

    const isValidCountry = regions.some(
      region => region.countries?.some(
        country => country.iso_2 === countryCode.toLowerCase()
      )
    )

    if (!isValidCountry) {
      throw notFound()
    }

    return { countryCode }
  },
  component: () => <Outlet />,
})
