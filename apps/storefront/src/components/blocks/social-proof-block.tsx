import React, { useState, useEffect } from 'react'

interface SocialProofBlockProps {
  heading?: string
  variant?: 'popup' | 'banner' | 'ticker' | 'inline'
  showPurchases?: boolean
  showReviews?: boolean
  maxItems?: number
  autoRotate?: boolean
}

const purchases = [
  { name: 'John', location: 'New York', product: 'Industrial Sensor Module', time: '2 minutes ago' },
  { name: 'Sarah', location: 'London', product: 'Smart Gateway Hub', time: '5 minutes ago' },
  { name: 'Mohammed', location: 'Dubai', product: 'Wireless Relay Kit', time: '8 minutes ago' },
  { name: 'Lisa', location: 'Sydney', product: 'Control Panel Pro', time: '12 minutes ago' },
  { name: 'Carlos', location: 'São Paulo', product: 'Safety Equipment Set', time: '15 minutes ago' },
  { name: 'Yuki', location: 'Tokyo', product: 'Server Rack Mount', time: '18 minutes ago' },
]

const reviews = [
  { name: 'Michael R.', rating: 5, text: 'Exceptional quality and fast shipping. Our team is very impressed.', product: 'Industrial Sensor Module' },
  { name: 'Aisha K.', rating: 5, text: 'Best bulk pricing we\'ve found. The approval workflow saved us hours.', product: 'Smart Gateway Hub' },
  { name: 'David L.', rating: 4, text: 'Solid product, great customer support. Will order again.', product: 'Wireless Relay Kit' },
  { name: 'Emma S.', rating: 5, text: 'Seamless B2B purchasing experience. Highly recommend for teams.', product: 'Control Panel Pro' },
]

const trustIndicators = [
  { label: '10,000+ Orders', icon: 'cart' },
  { label: '4.8/5 Rating', icon: 'star' },
  { label: '500+ Companies', icon: 'building' },
  { label: '99.9% Uptime', icon: 'check' },
]

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3.5 h-3.5 ${star <= rating ? 'text-ds-warning' : 'text-ds-muted'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

export const SocialProofBlock: React.FC<SocialProofBlockProps> = ({
  heading = 'Trusted by Businesses Worldwide',
  variant = 'inline',
  showPurchases = true,
  showReviews = true,
  maxItems = 6,
  autoRotate = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!autoRotate || variant !== 'popup') return
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchases.length)
        setVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [autoRotate, variant])

  if (variant === 'popup') {
    const item = purchases[currentIndex]
    return (
      <div
        className={`fixed bottom-4 left-4 z-50 max-w-xs border border-ds-border rounded-lg p-4 bg-ds-card shadow-lg transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-ds-success/10 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-ds-foreground">
              <span className="font-semibold">{item.name}</span> from {item.location}
            </p>
            <p className="text-xs text-ds-muted-foreground">
              just purchased <span className="font-medium text-ds-foreground">{item.product}</span>
            </p>
            <p className="text-[10px] text-ds-muted-foreground mt-1">{item.time}</p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <section className="w-full bg-ds-muted border-y border-ds-border overflow-hidden">
        <div className="flex animate-[scroll_30s_linear_infinite]">
          {[...purchases, ...purchases].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-6 py-3 whitespace-nowrap shrink-0">
              <svg className="w-3.5 h-3.5 text-ds-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-ds-foreground">
                <span className="font-semibold">{item.name}</span> from {item.location} just purchased{' '}
                <span className="font-medium">{item.product}</span>
              </span>
              <span className="text-xs text-ds-muted-foreground">· {item.time}</span>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>
    )
  }

  if (variant === 'ticker') {
    const item = purchases[currentIndex]
    return (
      <>
        <div
          className={`fixed bottom-4 right-4 z-50 w-72 border border-ds-border rounded-lg bg-ds-card shadow-lg overflow-hidden transition-all duration-300 ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-ds-primary px-3 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ds-primary-foreground">Live Activity</span>
            <div className="w-2 h-2 rounded-full bg-ds-primary-foreground animate-pulse" />
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-ds-success/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-ds-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-ds-foreground">
                <span className="font-semibold">{item.name}</span> from {item.location}
              </p>
            </div>
            <p className="text-xs text-ds-muted-foreground">
              purchased <span className="font-medium text-ds-foreground">{item.product}</span>
            </p>
            <p className="text-[10px] text-ds-muted-foreground mt-1">{item.time}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground text-center mb-4">
          {heading}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10">
          {trustIndicators.map((indicator) => (
            <div key={indicator.label} className="flex items-center gap-2 text-ds-muted-foreground">
              <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {indicator.icon === 'cart' && <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />}
                {indicator.icon === 'star' && <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                {indicator.icon === 'building' && <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
                {indicator.icon === 'check' && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
              </svg>
              <span className="text-sm font-medium">{indicator.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showPurchases && (
            <div className="border border-ds-border rounded-lg bg-ds-card">
              <div className="px-5 py-4 border-b border-ds-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ds-success animate-pulse" />
                <h3 className="text-sm font-semibold text-ds-foreground">Recent Purchases</h3>
              </div>
              <div className="divide-y divide-ds-border">
                {purchases.slice(0, maxItems).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-ds-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-ds-primary">{item.name[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ds-foreground truncate">
                        <span className="font-medium">{item.name}</span> from {item.location}
                      </p>
                      <p className="text-xs text-ds-muted-foreground truncate">
                        purchased {item.product}
                      </p>
                    </div>
                    <span className="text-[10px] text-ds-muted-foreground whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showReviews && (
            <div className="border border-ds-border rounded-lg bg-ds-card">
              <div className="px-5 py-4 border-b border-ds-border">
                <h3 className="text-sm font-semibold text-ds-foreground">Recent Reviews</h3>
              </div>
              <div className="divide-y divide-ds-border">
                {reviews.slice(0, maxItems).map((review, idx) => (
                  <div key={idx} className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={review.rating} />
                      <span className="text-xs font-medium text-ds-foreground">{review.name}</span>
                    </div>
                    <p className="text-sm text-ds-foreground mb-1">{review.text}</p>
                    <p className="text-xs text-ds-muted-foreground">Re: {review.product}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
