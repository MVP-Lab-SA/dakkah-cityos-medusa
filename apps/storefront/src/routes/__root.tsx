import Layout from "@/components/layout"
import { listRegions } from "@/lib/data/regions"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { lazy } from "react"
import appCss from "../styles/app.css?url"
import { BrandingProvider } from "@/lib/context/branding-context"
import { StoreProvider, type StoreConfig } from "@/lib/store-context"
import { detectAndFetchStore } from "@/lib/store-detector"

const NotFound = lazy(() => import("@/components/not-found"))

const BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: async ({ context }) => {
    const { queryClient } = context
    
    // Detect store from hostname (SSR-safe)
    let storeConfig: StoreConfig | null = null
    
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const { store } = await detectAndFetchStore(hostname, BACKEND_URL)
      storeConfig = store
    }
    
    // Pre-populate regions cache
    await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions({ fields: "id, name, currency_code, *countries" }),
    })
    
    return { store: storeConfig }
  },
  head: () => ({
    links: [
      { rel: "icon", href: "/images/medusa.svg" },
      { rel: "stylesheet", href: appCss },
    ],
    meta: [
      { title: "Medusa Storefront" },
      { charSet: "UTF-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
    scripts: [],
  }),
  notFoundComponent: NotFound,
  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  const loaderData = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <StoreProvider initialStore={loaderData.store}>
            <BrandingProvider>
              <Layout />
            </BrandingProvider>
          </StoreProvider>
        </QueryClientProvider>

        <Scripts />
      </body>
    </html>
  )
}
