// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/white-label-shop/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/white-label", params })
  },
  component: () => null,
})
