// @ts-nocheck
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/$tenant/$locale/crowdfunding/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$tenant/$locale/campaigns/$id", params })
  },
  component: () => null,
})
