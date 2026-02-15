import React, { useState } from 'react'

interface BidHistoryEntry {
  bidder: string
  amount: number
  time: string
}

interface AuctionBiddingBlockProps {
  auctionId?: string
  showHistory?: boolean
  showCountdown?: boolean
  variant?: 'full' | 'compact' | 'live'
}

const placeholderBids: BidHistoryEntry[] = [
  { bidder: 'User***42', amount: 1250, time: '2 min ago' },
  { bidder: 'User***78', amount: 1200, time: '5 min ago' },
  { bidder: 'User***15', amount: 1100, time: '12 min ago' },
  { bidder: 'User***91', amount: 1000, time: '18 min ago' },
  { bidder: 'User***33', amount: 950, time: '25 min ago' },
]

export const AuctionBiddingBlock: React.FC<AuctionBiddingBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  auctionId,
  showHistory = true,
  showCountdown = true,
  variant = 'full',
}) => {
  const [bidAmount, setBidAmount] = useState('')

  const currentBid = 1250
  const minIncrement = 50
  const nextMinBid = currentBid + minIncrement

  if (variant === 'compact') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-ds-muted-foreground mb-1">Current Bid</p>
              <p className="text-3xl font-bold text-ds-foreground">$1,250.00</p>
            </div>
            {showCountdown && (
              <div className="text-center mb-4">
                <p className="text-sm text-ds-muted-foreground">Ends in</p>
                <p className="text-lg font-semibold text-ds-foreground">02:15:30</p>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={`Min $${nextMinBid}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm"
              />
              <button className="px-4 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                Place Bid
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'live') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="bg-ds-card border-2 border-ds-primary rounded-lg shadow-sm overflow-hidden">
            <div className="bg-ds-primary px-4 py-2 flex items-center justify-between">
              <span className="text-ds-primary-foreground font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-ds-destructive/80 rounded-full animate-pulse" />
                LIVE AUCTION
              </span>
              {showCountdown && (
                <span className="text-ds-primary-foreground text-sm font-mono">02:15:30</span>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-lg bg-ds-muted animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ds-foreground mb-1">Auction Item</h3>
                  <p className="text-sm text-ds-muted-foreground mb-2">Premium collectible item</p>
                  <p className="text-3xl font-bold text-ds-foreground">$1,250.00</p>
                  <p className="text-xs text-ds-muted-foreground">15 bids · Min increment: ${minIncrement}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={`$${nextMinBid} or more`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-ds-border bg-ds-background text-ds-foreground"
                />
                <button className="px-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Place Bid
                </button>
              </div>
              {showHistory && (
                <div className="mt-4 max-h-40 overflow-y-auto">
                  {placeholderBids.map((bid, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-ds-border last:border-0 text-sm">
                      <span className="text-ds-foreground">{bid.bidder}</span>
                      <span className="font-semibold text-ds-foreground">${bid.amount.toLocaleString()}</span>
                      <span className="text-ds-muted-foreground text-xs">{bid.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-ds-muted rounded-lg aspect-square flex items-center justify-center">
            <div className="w-full h-full bg-ds-muted rounded-lg animate-pulse" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-2">Auction Item</h2>
            <p className="text-ds-muted-foreground mb-6">Premium collectible item available for bidding</p>

            {showCountdown && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-ds-muted-foreground">Time Remaining:</span>
                <div className="flex gap-2">
                  {['02', '15', '30'].map((val, i) => (
                    <div key={i} className="bg-ds-muted rounded-lg px-3 py-2 text-center">
                      <p className="text-xl font-bold font-mono text-ds-foreground">{val}</p>
                      <p className="text-xs text-ds-muted-foreground">{['hrs', 'min', 'sec'][i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-ds-card border border-ds-border rounded-lg p-6 mb-6">
              <p className="text-sm text-ds-muted-foreground mb-1">Current Bid</p>
              <p className="text-4xl font-bold text-ds-foreground mb-2">$1,250.00</p>
              <p className="text-sm text-ds-muted-foreground">15 bids · Minimum increment: ${minIncrement}</p>
            </div>

            <div className="flex gap-3 mb-6">
              <input
                type="number"
                placeholder={`Enter $${nextMinBid} or more`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-ds-border bg-ds-background text-ds-foreground"
              />
              <button className="px-8 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Place Bid
              </button>
            </div>

            {showHistory && (
              <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-ds-border">
                  <h3 className="font-semibold text-ds-foreground text-sm">Bid History</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ds-border">
                      <th className="text-left px-4 py-2 text-ds-muted-foreground font-medium">Bidder</th>
                      <th className="text-right px-4 py-2 text-ds-muted-foreground font-medium">Amount</th>
                      <th className="text-right px-4 py-2 text-ds-muted-foreground font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placeholderBids.map((bid, i) => (
                      <tr key={i} className="border-b border-ds-border last:border-0">
                        <td className="px-4 py-2 text-ds-foreground">{bid.bidder}</td>
                        <td className="px-4 py-2 text-right font-semibold text-ds-foreground">${bid.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-ds-muted-foreground">{bid.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
