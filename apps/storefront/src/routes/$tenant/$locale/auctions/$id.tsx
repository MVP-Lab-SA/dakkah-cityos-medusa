import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/$tenant/$locale/auctions/$id")({
  component: AuctionDetailPage,
})

function AuctionDetailPage() {
  const { tenant, locale, id } = Route.useParams()
  const [auction, setAuction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/store/auctions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAuction(data.auction || data.item || data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [id])

  const getTimeRemaining = (endDate: string) => {
    try {
      const diff = new Date(endDate).getTime() - Date.now()
      if (diff <= 0) return "Auction ended"
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      if (days > 0) return `${days} days, ${hours} hours remaining`
      return `${hours} hours, ${minutes} minutes remaining`
    } catch {
      return auction?.time_remaining || ""
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Auction not found</p>
          <Link
            to={`/${tenant}/${locale}/auctions` as any}
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            Back to auctions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-zinc-900 text-white py-12">
        <div className="content-container">
          <Link
            to={`/${tenant}/${locale}/auctions` as any}
            className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-6"
          >
            ← Back to auctions
          </Link>
          <h1 className="text-3xl font-bold">{auction.title || auction.name}</h1>
          {(auction.end_date || auction.time_remaining) && (
            <div className="mt-3 inline-flex items-center gap-2 bg-red-600/20 text-red-300 px-3 py-1.5 rounded text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {auction.end_date ? getTimeRemaining(auction.end_date) : auction.time_remaining}
            </div>
          )}
        </div>
      </div>

      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {(auction.thumbnail || auction.image) && (
              <div className="rounded-lg overflow-hidden bg-zinc-100 h-96">
                <img
                  src={auction.thumbnail || auction.image}
                  alt={auction.title || auction.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {auction.description && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
                <p className="text-zinc-600 leading-relaxed">{auction.description}</p>
              </div>
            )}

            {auction.bids && auction.bids.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                  Bid History ({auction.bids.length} bids)
                </h2>
                <div className="divide-y divide-zinc-100">
                  {auction.bids.map((bid: any, i: number) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900">{bid.bidder || `Bidder ${i + 1}`}</p>
                        {bid.created_at && (
                          <p className="text-xs text-zinc-400">
                            {new Date(bid.created_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-zinc-900">${Number(bid.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg border border-zinc-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <p className="text-sm text-zinc-400 uppercase">Current Bid</p>
                <p className="text-3xl font-bold text-zinc-900 mt-1">
                  ${Number(auction.current_bid || auction.current_price || 0).toLocaleString()}
                </p>
                {auction.starting_price != null && (
                  <p className="text-sm text-zinc-400 mt-1">
                    Starting price: ${Number(auction.starting_price).toLocaleString()}
                  </p>
                )}
              </div>

              {auction.bids_count != null && (
                <p className="text-sm text-zinc-500 text-center mb-4">{auction.bids_count} bids placed</p>
              )}

              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Enter your bid"
                  className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
                <button className="w-full bg-zinc-900 text-white py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
                  Place Bid
                </button>
              </div>

              {(auction.end_date || auction.time_remaining) && (
                <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
                  <p className="text-sm text-zinc-500">
                    {auction.end_date ? getTimeRemaining(auction.end_date) : auction.time_remaining}
                  </p>
                </div>
              )}

              {auction.seller && (
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-sm text-zinc-400">Seller</p>
                  <p className="font-medium text-zinc-900">{auction.seller.name || auction.seller}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
