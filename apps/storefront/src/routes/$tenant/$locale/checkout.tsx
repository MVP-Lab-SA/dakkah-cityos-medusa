import { createFileRoute, notFound } from "@tanstack/react-router"
import Checkout from "@/pages/checkout"
import { getRegion } from "@/lib/data/regions"
import { CheckoutStepKey } from "@/lib/types/global"

export const Route = createFileRoute("/$tenant/$locale/checkout")({
  validateSearch: (search) => {
    let step = search.step
    if (!Object.values(CheckoutStepKey).includes(step as CheckoutStepKey)) {
      step = "addresses"
    }
    return {
      step,
    }
  },
  loaderDeps: ({ search: { step } }) => {
    return {
      step,
    }
  },
  loader: async ({ params, context, deps }) => {
    const { locale } = params
    const { queryClient } = context
    const { step } = deps

    const region = await queryClient.ensureQueryData({
      queryKey: ["region", locale],
      queryFn: () => getRegion({ country_code: locale }),
    })

    if (!region) {
      throw notFound()
    }

    return {
      region,
      locale,
      step,
    }
  },
  component: Checkout,
})