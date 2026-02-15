// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/print-on-demand-shop/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/print-on-demand", params })
  },
  component: () => null,
  head: () => ({
    meta: [
      { title: "Print on Demand | Dakkah CityOS" },
      { name: "description", content: "Browse print on demand shop on Dakkah CityOS" },
    ],
  }),
})
