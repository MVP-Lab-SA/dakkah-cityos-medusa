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
import rtlCss from "../styles/rtl.css?url"
import { BrandingProvider } from "@/lib/context/branding-context"
import { AuthProvider } from "@/lib/context/auth-context"
import { StoreProvider, type StoreConfig } from "@/lib/store-context"
import { ToastProvider } from "@/components/ui/toast"

const NotFound = lazy(() => import("@/components/not-found"))

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  loader: async ({ context }) => {
    const { queryClient } = context
    
    // Pre-populate regions cache
    await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions({ fields: "id, name, currency_code, *countries" }),
    })
    
    // Single-store mode - no multi-tenant detection needed
    return { store: null as StoreConfig | null }
  },
  head: () => ({
    links: [
      { rel: "icon", href: "/images/medusa.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: rtlCss },
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
            <AuthProvider>
              <BrandingProvider>
                <ToastProvider>
                  <Layout />
                </ToastProvider>
              </BrandingProvider>
            </AuthProvider>
          </StoreProvider>
        </QueryClientProvider>

        <Scripts />
      </body>
    </html>
  )
}
