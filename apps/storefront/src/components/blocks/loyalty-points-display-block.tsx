import React from 'react'

interface LoyaltyPointsDisplayBlockProps {
  variant?: 'header' | 'card' | 'inline' | 'widget'
  showHistory?: boolean
  showRedemption?: boolean
  showTier?: boolean
}

const pointsData = {
  balance: 4250,
  tier: 'Gold',
  nextTier: 'Platinum',
  nextTierThreshold: 5000,
  lifetimeEarned: 12800,
}

const tiers = [
  { name: 'Bronze', min: 0, color: 'bg-ds-warning/90' },
  { name: 'Silver', min: 1000, color: 'bg-ds-muted-foreground/70' },
  { name: 'Gold', min: 2500, color: 'bg-ds-warning' },
  { name: 'Platinum', min: 5000, color: 'bg-ds-primary' },
]

const redeemOptions = [
  { label: '$5 Store Credit', points: 500 },
  { label: '$10 Store Credit', points: 1000 },
  { label: 'Free Shipping', points: 750 },
  { label: '15% Off Next Order', points: 1500 },
]

const transactions = [
  { description: 'Purchase Order #PO-847', points: 150, type: 'earned' as const, date: 'Feb 10, 2026' },
  { description: 'Redeemed: $10 Store Credit', points: -1000, type: 'redeemed' as const, date: 'Feb 8, 2026' },
  { description: 'Purchase Order #PO-845', points: 320, type: 'earned' as const, date: 'Feb 5, 2026' },
  { description: 'Referral Bonus', points: 500, type: 'earned' as const, date: 'Feb 3, 2026' },
  { description: 'Purchase Order #PO-840', points: 200, type: 'earned' as const, date: 'Feb 1, 2026' },
]

const tierProgress = ((pointsData.balance - 2500) / (pointsData.nextTierThreshold - 2500)) * 100

export const LoyaltyPointsDisplayBlock: React.FC<LoyaltyPointsDisplayBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  variant = 'card',
  showHistory = true,
  showRedemption = true,
  showTier = true,
}) => {
  if (variant === 'header') {
    return (
      <div className="w-full bg-ds-muted border-b border-ds-border">
        <div className="container mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-ds-warning" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-ds-foreground">{pointsData.balance.toLocaleString()} points</span>
            {showTier && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-ds-warning/20 text-ds-warning">
                {pointsData.tier}
              </span>
            )}
          </div>
          <span className="text-xs text-ds-muted-foreground">
            Earn {(pointsData.nextTierThreshold - pointsData.balance).toLocaleString()} more for {pointsData.nextTier}
          </span>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <section className="py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-ds-muted/50 rounded-lg border border-ds-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ds-warning/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-ds-warning" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-ds-foreground">{pointsData.balance.toLocaleString()} points</p>
                {showTier && (
                  <p className="text-xs text-ds-muted-foreground">
                    <span className="font-medium text-ds-warning">{pointsData.tier}</span> member
                  </p>
                )}
              </div>
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <div className="flex justify-between text-xs text-ds-muted-foreground mb-1">
                <span>{pointsData.tier}</span>
                <span>{pointsData.nextTier}</span>
              </div>
              <div className="w-full h-2 bg-ds-muted rounded-full overflow-hidden">
                <div className="h-full bg-ds-warning rounded-full" style={{ width: `${tierProgress}%` }} />
              </div>
              <p className="text-xs text-ds-muted-foreground mt-1 text-center">
                {(pointsData.nextTierThreshold - pointsData.balance).toLocaleString()} points to {pointsData.nextTier}
              </p>
            </div>
            {showRedemption && (
              <button type="button" className="px-4 py-2 text-sm font-medium rounded-md bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap">
                Redeem Points
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'widget') {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xs mx-auto border border-ds-border rounded-lg bg-ds-card shadow-sm overflow-hidden">
            <div className="bg-ds-primary px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-ds-primary-foreground/70 mb-1">Loyalty Points</p>
              <p className="text-2xl font-bold text-ds-primary-foreground">{pointsData.balance.toLocaleString()}</p>
              {showTier && (
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-ds-primary-foreground/20 text-ds-primary-foreground">
                  {pointsData.tier} Tier
                </span>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-ds-muted-foreground mb-1">
                  <span>Progress to {pointsData.nextTier}</span>
                  <span>{Math.round(tierProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-ds-muted rounded-full overflow-hidden">
                  <div className="h-full bg-ds-primary rounded-full" style={{ width: `${tierProgress}%` }} />
                </div>
              </div>
              {showRedemption && (
                <button type="button" className="w-full py-2 text-xs font-medium rounded-md bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity">
                  Redeem Points
                </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border border-ds-border rounded-lg bg-ds-card overflow-hidden">
            <div className="bg-ds-primary px-6 py-6 text-center">
              <p className="text-xs uppercase tracking-wider text-ds-primary-foreground/70 mb-2">Your Points Balance</p>
              <p className="text-4xl font-bold text-ds-primary-foreground mb-2">
                {pointsData.balance.toLocaleString()}
              </p>
              {showTier && (
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-ds-primary-foreground/20 text-ds-primary-foreground">
                  {pointsData.tier} Member
                </span>
              )}
            </div>
            {showTier && (
              <div className="px-6 py-4">
                <div className="flex justify-between text-xs text-ds-muted-foreground mb-2">
                  <span>Progress to {pointsData.nextTier}</span>
                  <span>{pointsData.balance.toLocaleString()} / {pointsData.nextTierThreshold.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-ds-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-ds-primary rounded-full transition-all" style={{ width: `${tierProgress}%` }} />
                </div>
                <p className="text-xs text-ds-muted-foreground text-center">
                  Earn <span className="font-semibold text-ds-foreground">{(pointsData.nextTierThreshold - pointsData.balance).toLocaleString()}</span> more points for {pointsData.nextTier}
                </p>

                <div className="flex justify-between mt-4 pt-4 border-t border-ds-border">
                  {tiers.map((t) => (
                    <div key={t.name} className="flex flex-col items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${t.color} ${t.name === pointsData.tier ? 'ring-2 ring-offset-2 ring-ds-primary' : ''}`} />
                      <span className={`text-[10px] ${t.name === pointsData.tier ? 'font-bold text-ds-foreground' : 'text-ds-muted-foreground'}`}>
                        {t.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {showRedemption && (
              <div className="border border-ds-border rounded-lg bg-ds-card">
                <div className="px-5 py-4 border-b border-ds-border">
                  <h3 className="text-sm font-semibold text-ds-foreground">Quick Redeem</h3>
                </div>
                <div className="p-4 space-y-2">
                  {redeemOptions.map((option) => (
                    <div
                      key={option.label}
                      className="flex items-center justify-between p-3 rounded-md border border-ds-border hover:bg-ds-muted/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-ds-foreground">{option.label}</p>
                        <p className="text-xs text-ds-muted-foreground">{option.points.toLocaleString()} points</p>
                      </div>
                      <button
                        type="button"
                        disabled={pointsData.balance < option.points}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-opacity ${
                          pointsData.balance >= option.points
                            ? 'bg-ds-primary text-ds-primary-foreground hover:opacity-90'
                            : 'bg-ds-muted text-ds-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        Redeem
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {showHistory && (
            <div className="border border-ds-border rounded-lg bg-ds-card">
              <div className="px-5 py-4 border-b border-ds-border">
                <h3 className="text-sm font-semibold text-ds-foreground">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-ds-border">
                {transactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ds-foreground truncate">{tx.description}</p>
                      <p className="text-xs text-ds-muted-foreground">{tx.date}</p>
                    </div>
                    <span className={`text-sm font-semibold whitespace-nowrap ms-3 ${
                      tx.type === 'earned' ? 'text-ds-success' : 'text-ds-destructive'
                    }`}>
                      {tx.type === 'earned' ? '+' : ''}{tx.points.toLocaleString()}
                    </span>
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
