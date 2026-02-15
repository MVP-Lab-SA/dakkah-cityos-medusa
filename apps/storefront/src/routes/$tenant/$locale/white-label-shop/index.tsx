// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/white-label-shop/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/white-label", params })
  },
  component: () => null,
  head: () => ({
    meta: [
      { title: "White Label | Dakkah CityOS" },
      { name: "description", content: "Browse white label shop on Dakkah CityOS" },
    ],
  }),
})
