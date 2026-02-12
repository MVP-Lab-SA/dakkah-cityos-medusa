import React from 'react'

interface LoyaltyDashboardBlockProps {
  showTierProgress?: boolean
  showHistory?: boolean
  showRewards?: boolean
  variant?: 'full' | 'compact' | 'widget'
}

interface Transaction {
  id: string
  description: string
  points: number
  date: string
  type: 'earned' | 'redeemed'
}

interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  image?: string
}

const transactions: Transaction[] = [
  { id: '1', description: 'Deep Tissue Massage', points: 120, date: 'Feb 10, 2026', type: 'earned' },
  { id: '2', description: 'Referral Bonus', points: 500, date: 'Feb 8, 2026', type: 'earned' },
  { id: '3', description: 'Free Coffee Redeemed', points: -200, date: 'Feb 5, 2026', type: 'redeemed' },
  { id: '4', description: 'Classic Facial', points: 85, date: 'Feb 3, 2026', type: 'earned' },
  { id: '5', description: 'Hair Cut & Style', points: 55, date: 'Jan 28, 2026', type: 'earned' },
]

const rewards: Reward[] = [
  { id: '1', name: 'Free Coffee', description: 'Enjoy a complimentary coffee at our café.', pointsCost: 200 },
  { id: '2', name: '$10 Discount', description: 'Get $10 off your next booking.', pointsCost: 500 },
  { id: '3', name: 'Free Upgrade', description: 'Upgrade to a premium service tier for free.', pointsCost: 1000 },
  { id: '4', name: 'VIP Experience', description: 'Exclusive VIP treatment on your next visit.', pointsCost: 2500 },
]

const currentPoints = 1850
const currentTier = 'Silver'
const nextTier = 'Gold'
const pointsToNext = 650
const tierProgress = 74

export const LoyaltyDashboardBlock: React.FC<LoyaltyDashboardBlockProps> = ({
  showTierProgress = true,
  showHistory = true,
  showRewards = true,
  variant = 'full',
}) => {
  if (variant === 'widget') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-sm mx-auto bg-ds-card border border-ds-border rounded-xl p-6">
            <div className="text-center mb-4">
              <p className="text-xs text-ds-muted-foreground uppercase tracking-wider mb-1">Your Points</p>
              <p className="text-4xl font-bold text-ds-foreground">{currentPoints.toLocaleString()}</p>
              <p className="text-sm text-ds-muted-foreground mt-1">{currentTier} Member</p>
            </div>

            {showTierProgress && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-ds-muted-foreground mb-1">
                  <span>{currentTier}</span>
                  <span>{nextTier}</span>
                </div>
                <div className="w-full h-2 bg-ds-muted rounded-full overflow-hidden">
                  <div className="h-full bg-ds-primary rounded-full transition-all" style={{ width: `${tierProgress}%` }} />
                </div>
                <p className="text-xs text-ds-muted-foreground mt-1 text-center">{pointsToNext} pts to {nextTier}</p>
              </div>
            )}

            <button className="w-full py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              View Rewards
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'compact') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto bg-ds-card border border-ds-border rounded-xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="text-center sm:text-left">
                <p className="text-xs text-ds-muted-foreground uppercase tracking-wider mb-1">Points Balance</p>
                <p className="text-5xl font-bold text-ds-foreground">{currentPoints.toLocaleString()}</p>
              </div>
              <div className="flex-1 w-full sm:w-auto">
                {showTierProgress && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-ds-foreground">{currentTier}</span>
                      <span className="text-ds-muted-foreground">{nextTier}</span>
                    </div>
                    <div className="w-full h-3 bg-ds-muted rounded-full overflow-hidden">
                      <div className="h-full bg-ds-primary rounded-full" style={{ width: `${tierProgress}%` }} />
                    </div>
                    <p className="text-xs text-ds-muted-foreground mt-1">{pointsToNext} points to reach {nextTier}</p>
                  </div>
                )}
              </div>
            </div>

            {showRewards && (
              <div className="grid grid-cols-2 gap-3">
                {rewards.slice(0, 4).map((reward) => (
                  <div key={reward.id} className="p-3 rounded-lg border border-ds-border">
                    <p className="text-sm font-medium text-ds-foreground">{reward.name}</p>
                    <p className="text-xs text-ds-muted-foreground">{reward.pointsCost} pts</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-ds-card border border-ds-border rounded-xl p-6 text-center">
              <p className="text-xs text-ds-muted-foreground uppercase tracking-wider mb-2">Points Balance</p>
              <p className="text-5xl font-bold text-ds-foreground">{currentPoints.toLocaleString()}</p>
              <p className="text-sm text-ds-muted-foreground mt-2">Available to redeem</p>
            </div>

            <div className="bg-ds-card border border-ds-border rounded-xl p-6 text-center">
              <p className="text-xs text-ds-muted-foreground uppercase tracking-wider mb-2">Current Tier</p>
              <p className="text-3xl font-bold text-ds-primary">{currentTier}</p>
              <p className="text-sm text-ds-muted-foreground mt-2">Member since Jan 2025</p>
            </div>

            <div className="bg-ds-card border border-ds-border rounded-xl p-6 text-center">
              <p className="text-xs text-ds-muted-foreground uppercase tracking-wider mb-2">Lifetime Points</p>
              <p className="text-5xl font-bold text-ds-foreground">4,230</p>
              <p className="text-sm text-ds-muted-foreground mt-2">Total earned</p>
            </div>
          </div>

          {showTierProgress && (
            <div className="bg-ds-card border border-ds-border rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-ds-foreground">Tier Progress</h3>
                <span className="text-sm text-ds-muted-foreground">{tierProgress}%</span>
              </div>
              <div className="w-full h-4 bg-ds-muted rounded-full overflow-hidden mb-2">
                <div className="h-full bg-ds-primary rounded-full transition-all" style={{ width: `${tierProgress}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-ds-primary">{currentTier}</span>
                <span className="text-ds-muted-foreground">{pointsToNext} points to {nextTier}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {showHistory && (
              <div className="bg-ds-card border border-ds-border rounded-xl p-6">
                <h3 className="font-semibold text-ds-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-ds-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-ds-foreground">{tx.description}</p>
                        <p className="text-xs text-ds-muted-foreground">{tx.date}</p>
                      </div>
                      <span className={`text-sm font-semibold ${tx.type === 'earned' ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.type === 'earned' ? '+' : ''}{tx.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showRewards && (
              <div className="bg-ds-card border border-ds-border rounded-xl p-6">
                <h3 className="font-semibold text-ds-foreground mb-4">Available Rewards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="p-4 rounded-lg border border-ds-border">
                      <div className="w-10 h-10 rounded-lg bg-ds-primary/10 flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-ds-foreground text-sm">{reward.name}</h4>
                      <p className="text-xs text-ds-muted-foreground mb-3">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ds-primary">{reward.pointsCost} pts</span>
                        <button
                          disabled={currentPoints < reward.pointsCost}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            currentPoints >= reward.pointsCost
                              ? 'bg-ds-primary text-ds-primary-foreground hover:opacity-90'
                              : 'bg-ds-muted text-ds-muted-foreground cursor-not-allowed'
                          }`}
                        >
                          Redeem
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
