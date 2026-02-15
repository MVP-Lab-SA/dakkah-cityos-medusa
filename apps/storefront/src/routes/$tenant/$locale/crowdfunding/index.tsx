// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/crowdfunding/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/campaigns", params })
  },
  component: () => null,
})
