import { routeTree } from "@/routeTree.gen"
import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { lazy } from "react"

const NotFound = lazy(() => import("@/components/not-found"))

export function createRouter() {
  const isServer = typeof window === "undefined"
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: !isServer,
        refetchOnReconnect: !isServer,
        retry: isServer ? 0 : 1,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: false,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
  })
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
