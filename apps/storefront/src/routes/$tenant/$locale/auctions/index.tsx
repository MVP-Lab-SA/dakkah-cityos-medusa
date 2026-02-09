import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/auctions/")({
  component: AuctionsPage,
})

function AuctionsPage() {
  const { tenant, locale } = Route.useParams()
  const [auctions, setAuctions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/store/auctions")
      .then((res) => res.json())
      .then((data) => {
        setAuctions(data.auctions || data.items || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="bg-zinc-900 text-white py-16">
        <div className="content-container">
          <h1 className="text-4xl font-bold mb-3">Live Auctions</h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Bid on unique items and exclusive deals. Browse active auctions and place your bids before time runs out.
          </p>
        </div>
      </section>

      <div className="content-container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-zinc-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-zinc-500">No active auctions at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} tenant={tenant} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AuctionCard({ auction, tenant, locale }: { auction: any; tenant: string; locale: string }) {
  const getTimeRemaining = (endDate: string) => {
    try {
      const diff = new Date(endDate).getTime() - Date.now()
      if (diff <= 0) return "Ended"
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      if (days > 0) return `${days}d ${hours}h left`
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m left`
    } catch {
      return auction.time_remaining || ""
    }
  }

  return (
    <Link
      to={`/${tenant}/${locale}/auctions/${auction.id}` as any}
      className="bg-white rounded-lg border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-zinc-100 relative">
        {(auction.thumbnail || auction.image) ? (
          <img
            src={auction.thumbnail || auction.image}
            alt={auction.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
        )}
        {(auction.end_date || auction.time_remaining) && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
            {auction.end_date ? getTimeRemaining(auction.end_date) : auction.time_remaining}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-zinc-900 text-lg">{auction.title || auction.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 uppercase">Current Bid</p>
            <p className="text-lg font-bold text-zinc-900">
              ${Number(auction.current_bid || auction.current_price || 0).toLocaleString()}
            </p>
          </div>
          {auction.bids_count != null && (
            <div className="text-right">
              <p className="text-xs text-zinc-400">Bids</p>
              <p className="text-sm font-medium text-zinc-700">{auction.bids_count}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
