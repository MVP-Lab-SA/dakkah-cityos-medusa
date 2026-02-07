import { createServerFileRoute } from "@tanstack/react-start/server"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/health")({})

export const ServerRoute = createServerFileRoute("/health").methods({
  GET: async () => {
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  },
})
