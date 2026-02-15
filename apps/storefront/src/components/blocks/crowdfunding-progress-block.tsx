import React, { useState } from 'react'

interface CrowdfundingProgressBlockProps {
  campaignId?: string
  showBackers?: boolean
  showUpdates?: boolean
  variant?: 'full' | 'widget' | 'minimal'
}

const placeholderCampaign = {
  title: 'EcoSmart Water Purifier',
  description: 'A portable, solar-powered water purification system that provides clean drinking water anywhere. Our innovative design uses advanced filtration technology to remove 99.9% of contaminants.',
  goal: 50000,
  raised: 37500,
  backers: 842,
  daysLeft: 18,
}

const recentBackers = [
  { name: 'Alex M.', amount: 150, time: '5 min ago' },
  { name: 'Sarah K.', amount: 50, time: '12 min ago' },
  { name: 'James R.', amount: 500, time: '1 hour ago' },
  { name: 'Maria L.', amount: 25, time: '2 hours ago' },
  { name: 'Tom W.', amount: 100, time: '3 hours ago' },
]

const presetAmounts = [25, 50, 100, 250, 500]

export const CrowdfundingProgressBlock: React.FC<CrowdfundingProgressBlockProps> = ({
  campaignId,
  showBackers = true,
  showUpdates = false,
  variant = 'full',
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50)
  const [customAmount, setCustomAmount] = useState('')

  const percentFunded = Math.round((placeholderCampaign.raised / placeholderCampaign.goal) * 100)

  if (variant === 'minimal') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <div className="bg-ds-card border border-ds-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-ds-foreground">{percentFunded}% funded</span>
              <span className="text-sm text-ds-muted-foreground">{placeholderCampaign.daysLeft} days left</span>
            </div>
            <div className="w-full bg-ds-muted rounded-full h-2 mb-3">
              <div className="bg-ds-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(percentFunded, 100)}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ds-muted-foreground">${placeholderCampaign.raised.toLocaleString()} of ${placeholderCampaign.goal.toLocaleString()}</span>
              <button className="px-4 py-2 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Back This Project
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'widget') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-sm">
          <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-ds-foreground text-lg mb-4">{placeholderCampaign.title}</h3>
            <div className="w-full bg-ds-muted rounded-full h-3 mb-3">
              <div className="bg-ds-primary h-3 rounded-full transition-all" style={{ width: `${Math.min(percentFunded, 100)}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div>
                <p className="text-lg font-bold text-ds-foreground">${(placeholderCampaign.raised / 1000).toFixed(1)}k</p>
                <p className="text-xs text-ds-muted-foreground">raised</p>
              </div>
              <div>
                <p className="text-lg font-bold text-ds-foreground">{percentFunded}%</p>
                <p className="text-xs text-ds-muted-foreground">funded</p>
              </div>
              <div>
                <p className="text-lg font-bold text-ds-foreground">{placeholderCampaign.daysLeft}</p>
                <p className="text-xs text-ds-muted-foreground">days left</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {presetAmounts.slice(0, 3).map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount('') }}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedAmount === amt
                      ? 'bg-ds-primary text-ds-primary-foreground'
                      : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <button className="w-full px-4 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Back This Project
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-ds-muted rounded-lg aspect-video animate-pulse mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-4">{placeholderCampaign.title}</h2>
            <p className="text-ds-muted-foreground mb-6">{placeholderCampaign.description}</p>

            {showBackers && (
              <div className="bg-ds-card border border-ds-border rounded-lg p-6">
                <h3 className="font-semibold text-ds-foreground mb-4">Recent Backers</h3>
                <div className="space-y-3">
                  {recentBackers.map((backer, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ds-muted animate-pulse" />
                        <span className="text-sm text-ds-foreground">{backer.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-ds-foreground">${backer.amount}</span>
                        <p className="text-xs text-ds-muted-foreground">{backer.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm p-6 sticky top-4">
              <div className="w-full bg-ds-muted rounded-full h-3 mb-4">
                <div className="bg-ds-primary h-3 rounded-full transition-all" style={{ width: `${Math.min(percentFunded, 100)}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <p className="text-xl font-bold text-ds-foreground">${(placeholderCampaign.raised / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-ds-muted-foreground">raised of ${(placeholderCampaign.goal / 1000).toFixed(0)}k</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-ds-foreground">{placeholderCampaign.backers}</p>
                  <p className="text-xs text-ds-muted-foreground">backers</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-ds-foreground">{placeholderCampaign.daysLeft}</p>
                  <p className="text-xs text-ds-muted-foreground">days left</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-ds-foreground mb-2">Select Amount</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount('') }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-ds-primary text-ds-primary-foreground'
                          : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
                  className="w-full px-4 py-2 rounded-lg border border-ds-border bg-ds-background text-ds-foreground text-sm"
                />
              </div>

              <button className="w-full px-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Back This Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
