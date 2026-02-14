// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { useState } from "react"

export const Route = createFileRoute("/$tenant/$locale/newsletter/")({
  component: NewsletterPage,
})

function NewsletterPage() {
  const { tenant, locale } = Route.useParams()
  const prefix = `/${tenant}/${locale}`
  const [searchQuery, setSearchQuery] = useState("")
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set())

  const { data, isLoading, error } = useQuery({
    queryKey: ["newsletters"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{ newsletters: any[]; count: number }>(
        `/store/newsletters`,
        { method: "GET", credentials: "include" }
      )
      return response
    },
  })

  const items = data?.newsletters || []

  const filteredItems = items.filter((item) =>
    searchQuery ? item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.description?.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  function handleSubscribe(id: string) {
    setSubscribedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-ds-background">
      <div className="bg-ds-card border-b border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-ds-muted-foreground mb-4">
            <Link to={`${prefix}` as any} className="hover:text-ds-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ds-foreground">Newsletter</span>
          </div>
          <h1 className="text-3xl font-bold text-ds-foreground">Newsletters</h1>
          <p className="mt-2 text-ds-muted-foreground">Stay informed with our curated newsletters — subscribe to topics that interest you</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search newsletters..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-ring"
          />
        </div>

        {error ? (
          <div className="bg-ds-destructive/10 border border-ds-destructive/20 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-ds-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-ds-destructive font-medium">Something went wrong loading newsletters.</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-ds-background border border-ds-border rounded-xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-1/3 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-ds-muted rounded animate-pulse" />
                    <div className="h-4 w-1/4 bg-ds-muted rounded animate-pulse" />
                  </div>
                  <div className="h-10 w-28 bg-ds-muted rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-ds-background border border-ds-border rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-ds-muted-foreground/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <h3 className="text-lg font-semibold text-ds-foreground mb-2">No newsletters found</h3>
            <p className="text-ds-muted-foreground text-sm">Check back later for new newsletter topics.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item: any) => {
              const isSubscribed = subscribedIds.has(item.id)
              return (
                <div
                  key={item.id}
                  className="bg-ds-background border border-ds-border rounded-xl p-6 hover:border-ds-primary/30 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-ds-foreground">{item.name || item.title}</h3>
                        {item.frequency && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-ds-muted text-ds-muted-foreground rounded">{item.frequency}</span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-ds-muted-foreground line-clamp-2">{item.description || "Stay up to date with the latest news and updates."}</p>
                      {item.category && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-ds-primary/10 text-ds-primary rounded">{item.category}</span>
                      )}
                      {item.subscriber_count !== undefined && (
                        <p className="mt-2 text-xs text-ds-muted-foreground">{Number(item.subscriber_count).toLocaleString()} subscribers</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleSubscribe(item.id)}
                      className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors flex-shrink-0 ${isSubscribed ? "bg-ds-muted text-ds-foreground hover:bg-ds-destructive/10 hover:text-ds-destructive" : "bg-ds-primary text-ds-primary-foreground hover:opacity-90"}`}
                    >
                      {isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
