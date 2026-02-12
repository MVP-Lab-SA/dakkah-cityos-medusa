import React, { useState } from 'react'

interface DonationCampaignBlockProps {
  campaignId?: string
  showImpact?: boolean
  presetAmounts?: number[]
  allowRecurring?: boolean
  variant?: 'full' | 'compact' | 'widget'
}

const placeholderCampaign = {
  title: 'Clean Water for Rural Communities',
  description: 'Help us build sustainable water infrastructure in underserved communities. Every dollar provides clean drinking water and improves lives. Your donation directly funds well construction, water treatment, and community education programs.',
  raised: 128500,
  goal: 200000,
  donors: 3240,
}

const impactStats = [
  { label: 'Wells Built', value: '12' },
  { label: 'People Served', value: '8,500+' },
  { label: 'Communities', value: '24' },
  { label: 'Countries', value: '5' },
]

const defaultPresets = [10, 25, 50, 100, 250]

export const DonationCampaignBlock: React.FC<DonationCampaignBlockProps> = ({
  campaignId,
  showImpact = true,
  presetAmounts = defaultPresets,
  allowRecurring = true,
  variant = 'full',
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50)
  const [customAmount, setCustomAmount] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)

  const percentFunded = Math.round((placeholderCampaign.raised / placeholderCampaign.goal) * 100)

  if (variant === 'widget') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-sm">
          <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-ds-foreground mb-3">{placeholderCampaign.title}</h3>
            <div className="w-full bg-ds-muted rounded-full h-2 mb-3">
              <div className="bg-ds-primary h-2 rounded-full transition-all" style={{ width: `${Math.min(percentFunded, 100)}%` }} />
            </div>
            <p className="text-sm text-ds-muted-foreground mb-4">${placeholderCampaign.raised.toLocaleString()} raised</p>
            <div className="flex gap-2 mb-3">
              {presetAmounts.slice(0, 3).map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount('') }}
                  className={`flex-1 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedAmount === amt
                      ? 'bg-ds-primary text-ds-primary-foreground'
                      : 'bg-ds-muted text-ds-muted-foreground'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <button className="w-full px-4 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Donate Now
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'compact') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-ds-muted animate-pulse aspect-square md:aspect-auto" />
              <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-ds-foreground mb-2">{placeholderCampaign.title}</h3>
                <p className="text-sm text-ds-muted-foreground mb-4 line-clamp-2">{placeholderCampaign.description}</p>
                <div className="w-full bg-ds-muted rounded-full h-2 mb-2">
                  <div className="bg-ds-primary h-2 rounded-full" style={{ width: `${Math.min(percentFunded, 100)}%` }} />
                </div>
                <p className="text-sm text-ds-muted-foreground mb-4">
                  ${placeholderCampaign.raised.toLocaleString()} raised of ${placeholderCampaign.goal.toLocaleString()} · {placeholderCampaign.donors.toLocaleString()} donors
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setCustomAmount('') }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-ds-primary text-ds-primary-foreground'
                          : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                {allowRecurring && (
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => setIsRecurring(false)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!isRecurring ? 'bg-ds-primary text-ds-primary-foreground' : 'bg-ds-muted text-ds-muted-foreground'}`}
                    >
                      One-time
                    </button>
                    <button
                      onClick={() => setIsRecurring(true)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isRecurring ? 'bg-ds-primary text-ds-primary-foreground' : 'bg-ds-muted text-ds-muted-foreground'}`}
                    >
                      Monthly
                    </button>
                  </div>
                )}
                <button className="w-full px-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Donate Now
                </button>
              </div>
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
          <div>
            <div className="bg-ds-muted rounded-lg aspect-video animate-pulse mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-4">{placeholderCampaign.title}</h2>
            <p className="text-ds-muted-foreground mb-6">{placeholderCampaign.description}</p>

            {showImpact && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {impactStats.map((stat, i) => (
                  <div key={i} className="bg-ds-card border border-ds-border rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-ds-foreground">{stat.value}</p>
                    <p className="text-xs text-ds-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="bg-ds-card border border-ds-border rounded-lg shadow-sm p-6 sticky top-4">
              <div className="w-full bg-ds-muted rounded-full h-3 mb-3">
                <div className="bg-ds-primary h-3 rounded-full transition-all" style={{ width: `${Math.min(percentFunded, 100)}%` }} />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold text-ds-foreground">${placeholderCampaign.raised.toLocaleString()}</p>
                  <p className="text-sm text-ds-muted-foreground">raised of ${placeholderCampaign.goal.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-ds-foreground">{placeholderCampaign.donors.toLocaleString()}</p>
                  <p className="text-sm text-ds-muted-foreground">donors</p>
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

              {allowRecurring && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-ds-foreground mb-2">Frequency</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsRecurring(false)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !isRecurring ? 'bg-ds-primary text-ds-primary-foreground' : 'bg-ds-muted text-ds-muted-foreground'
                      }`}
                    >
                      One-time
                    </button>
                    <button
                      onClick={() => setIsRecurring(true)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isRecurring ? 'bg-ds-primary text-ds-primary-foreground' : 'bg-ds-muted text-ds-muted-foreground'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
              )}

              <button className="w-full px-6 py-3 bg-ds-primary text-ds-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
