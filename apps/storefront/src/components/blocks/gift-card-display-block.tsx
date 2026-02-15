import React from 'react'

interface GiftCardDisplayBlockProps {
  heading?: string
  denominations?: number[]
  allowCustomAmount?: boolean
  variant?: 'default' | 'compact' | 'premium'
}

export const GiftCardDisplayBlock: React.FC<GiftCardDisplayBlockProps> = ({
  heading = 'Gift Cards',
  denominations = [25, 50, 75, 100, 150, 200],
  allowCustomAmount = true,
  variant = 'default',
}) => {
  const [selectedDenomination, setSelectedDenomination] = React.useState<number | null>(null)
  const [customAmount, setCustomAmount] = React.useState('')
  const [recipientEmail, setRecipientEmail] = React.useState('')
  const [senderName, setSenderName] = React.useState('')
  const [message, setMessage] = React.useState('')

  const isCompact = variant === 'compact'

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {heading && (
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground">{heading}</h2>
            <p className="text-ds-muted-foreground mt-2">The perfect gift for any occasion</p>
          </div>
        )}

        <div className={`max-w-4xl mx-auto ${isCompact ? '' : 'grid grid-cols-1 md:grid-cols-2 gap-8'}`}>
          <div className={`${isCompact ? 'mb-6' : ''}`}>
            <div className={`relative rounded-xl overflow-hidden ${variant === 'premium' ? 'shadow-xl' : 'shadow-md'}`}>
              <div className="aspect-[16/10] bg-gradient-to-br from-ds-primary to-ds-primary/60 flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-ds-primary-foreground/80 text-sm mb-1">Gift Card</p>
                  <p className="text-3xl md:text-4xl font-bold text-ds-primary-foreground">
                    ${selectedDenomination || customAmount || '---'}
                  </p>
                  <p className="text-ds-primary-foreground/60 text-xs mt-2">Store Credit</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-3">Select Amount</label>
              <div className="grid grid-cols-3 gap-2">
                {denominations.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedDenomination(amount)
                      setCustomAmount('')
                    }}
                    className={`py-3 rounded-lg text-sm font-semibold border transition-colors ${
                      selectedDenomination === amount
                        ? 'border-ds-primary bg-ds-primary text-ds-primary-foreground'
                        : 'border-ds-border text-ds-foreground hover:bg-ds-muted'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {allowCustomAmount && (
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-1">Custom Amount</label>
                <div className="relative">
                  <span className="absolute start-3 top-1/2 -translate-y-1/2 text-ds-muted-foreground">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedDenomination(null)
                    }}
                    placeholder="Enter amount"
                    min="1"
                    className="w-full ps-8 pe-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">Recipient Email</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@email.com"
                className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">Your Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">Personal Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message..."
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
              />
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-lg bg-ds-primary text-ds-primary-foreground font-semibold hover:bg-ds-primary/90 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
