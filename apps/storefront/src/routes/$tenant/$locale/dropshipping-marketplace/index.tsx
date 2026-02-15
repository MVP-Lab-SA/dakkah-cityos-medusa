// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/dropshipping-marketplace/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/dropshipping", params })
  },
  component: () => null,
  head: () => ({
    meta: [
      { title: "Dropshipping | Dakkah CityOS" },
      { name: "description", content: "Browse the dropshipping marketplace on Dakkah CityOS" },
    ],
  }),
})
