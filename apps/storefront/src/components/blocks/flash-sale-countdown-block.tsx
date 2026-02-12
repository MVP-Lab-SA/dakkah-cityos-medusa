import React from 'react'

interface FlashSaleCountdownBlockProps {
  heading?: string
  endDate: string
  products?: { id: string; name: string; price: number; originalPrice: number }[]
  backgroundStyle?: 'default' | 'gradient' | 'dark'
}

export const FlashSaleCountdownBlock: React.FC<FlashSaleCountdownBlockProps> = ({
  heading = 'Flash Sale',
  endDate,
  products,
  backgroundStyle = 'default',
}) => {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  const bgClass =
    backgroundStyle === 'gradient'
      ? 'bg-gradient-to-r from-ds-destructive/10 to-ds-primary/10'
      : backgroundStyle === 'dark'
      ? 'bg-ds-foreground text-ds-background'
      : 'bg-ds-card'

  const textClass = backgroundStyle === 'dark' ? 'text-ds-background' : 'text-ds-foreground'
  const mutedTextClass = backgroundStyle === 'dark' ? 'text-ds-background/70' : 'text-ds-muted-foreground'

  const placeholderProducts = products || [
    { id: '1', name: 'Deal Item 1', price: 39.99, originalPrice: 79.99 },
    { id: '2', name: 'Deal Item 2', price: 24.99, originalPrice: 49.99 },
    { id: '3', name: 'Deal Item 3', price: 59.99, originalPrice: 119.99 },
    { id: '4', name: 'Deal Item 4', price: 14.99, originalPrice: 34.99 },
  ]

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <section className={`py-12 md:py-16 lg:py-20 ${bgClass}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <svg className="w-6 h-6 text-ds-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className={`text-2xl md:text-3xl font-bold ${textClass}`}>{heading}</h2>
          </div>
          <p className={`text-sm ${mutedTextClass}`}>Hurry up! Sale ends soon.</p>
        </div>

        <div className="flex justify-center gap-3 md:gap-4 mb-10">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="text-center">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-lg border border-ds-border ${backgroundStyle === 'dark' ? 'bg-ds-background/10' : 'bg-ds-background'} flex items-center justify-center`}>
                <span className={`text-2xl md:text-3xl font-bold ${textClass}`}>
                  {String(unit.value).padStart(2, '0')}
                </span>
              </div>
              <span className={`text-xs mt-1 block ${mutedTextClass}`}>{unit.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {placeholderProducts.map((product) => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            return (
              <div key={product.id} className="bg-ds-card border border-ds-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="bg-ds-muted aspect-square" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold bg-ds-destructive text-ds-destructive-foreground">
                    -{discount}%
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-ds-foreground truncate">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-ds-foreground">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-ds-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    className="w-full mt-3 py-2 rounded-md bg-ds-destructive text-ds-destructive-foreground text-sm font-medium hover:bg-ds-destructive/90 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
