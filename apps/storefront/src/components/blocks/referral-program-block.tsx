import React, { useState } from 'react'

interface ReferralProgramBlockProps {
  heading?: string
  description?: string
  rewardType?: 'credit' | 'discount' | 'points'
  rewardValue?: number
  showLeaderboard?: boolean
  variant?: 'full' | 'card' | 'widget'
}

const referralStats = {
  sent: 24,
  accepted: 12,
  earned: 120,
}

const leaderboard = [
  { rank: 1, name: 'Sarah Chen', referrals: 45, earned: '$450' },
  { rank: 2, name: 'James Wilson', referrals: 38, earned: '$380' },
  { rank: 3, name: 'Maria Garcia', referrals: 31, earned: '$310' },
  { rank: 4, name: 'Ahmed Hassan', referrals: 24, earned: '$240' },
  { rank: 5, name: 'Lisa Park', referrals: 19, earned: '$190' },
]

const referralLink = 'https://store.example.com/ref/ABC123XYZ'

export const ReferralProgramBlock: React.FC<ReferralProgramBlockProps> = ({
  heading = 'Refer & Earn',
  description = 'Share the love with your business partners. When they sign up and make their first purchase, you both earn rewards!',
  rewardType = 'credit',
  rewardValue = 10,
  showLeaderboard = true,
  variant = 'full',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const rewardLabel = rewardType === 'credit' ? `$${rewardValue}` : rewardType === 'discount' ? `${rewardValue}%` : `${rewardValue} pts`
  const rewardText = `Give ${rewardLabel}, Get ${rewardLabel}`

  if (variant === 'widget') {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-sm mx-auto border border-ds-border rounded-lg p-5 bg-ds-card shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-ds-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-ds-foreground">{heading}</p>
                <p className="text-xs text-ds-primary font-medium">{rewardText}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-3 py-2 text-xs rounded-md border border-ds-border bg-ds-muted text-ds-muted-foreground truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 text-xs font-medium rounded-md bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'card') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-lg mx-auto border border-ds-border rounded-lg bg-ds-card shadow-sm overflow-hidden">
            <div className="bg-ds-primary px-6 py-5 text-center">
              <h2 className="text-xl font-bold text-ds-primary-foreground mb-1">{heading}</h2>
              <p className="text-sm text-ds-primary-foreground/80">{rewardText}</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-ds-muted-foreground mb-4 text-center">{description}</p>

              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 py-2.5 text-sm rounded-md border border-ds-border bg-ds-muted text-ds-muted-foreground truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2.5 text-sm font-medium rounded-md bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex justify-center gap-3 mb-6">
                {['twitter', 'linkedin', 'email'].map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    className="w-10 h-10 rounded-full bg-ds-muted flex items-center justify-center text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted/80 transition-colors"
                  >
                    {platform === 'twitter' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                    )}
                    {platform === 'linkedin' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    )}
                    {platform === 'email' && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    )}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-ds-muted/50 rounded-md">
                  <p className="text-lg font-bold text-ds-foreground">{referralStats.sent}</p>
                  <p className="text-[10px] text-ds-muted-foreground">Sent</p>
                </div>
                <div className="text-center p-3 bg-ds-muted/50 rounded-md">
                  <p className="text-lg font-bold text-ds-foreground">{referralStats.accepted}</p>
                  <p className="text-[10px] text-ds-muted-foreground">Accepted</p>
                </div>
                <div className="text-center p-3 bg-ds-success/10 rounded-md">
                  <p className="text-lg font-bold text-ds-success">${referralStats.earned}</p>
                  <p className="text-[10px] text-ds-muted-foreground">Earned</p>
                </div>
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
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ds-foreground mb-3">
            {heading}
          </h2>
          <p className="text-ds-muted-foreground max-w-2xl mx-auto mb-4">{description}</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ds-primary/10 border border-ds-primary/20">
            <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="text-sm font-semibold text-ds-primary">{rewardText}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="border border-ds-border rounded-lg p-6 bg-ds-card">
              <h3 className="text-sm font-semibold text-ds-foreground mb-4">Your Referral Link</h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 py-2.5 text-sm rounded-md border border-ds-border bg-ds-muted text-ds-muted-foreground truncate font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-5 py-2.5 text-sm font-medium rounded-md bg-ds-primary text-ds-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              <p className="text-xs text-ds-muted-foreground mb-3">Share via:</p>
              <div className="flex gap-2">
                {['Twitter', 'LinkedIn', 'Email', 'WhatsApp'].map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    className="px-4 py-2 text-xs font-medium rounded-md bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted/80 transition-colors"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="border border-ds-border rounded-lg p-4 bg-ds-card text-center">
                <p className="text-2xl font-bold text-ds-foreground">{referralStats.sent}</p>
                <p className="text-xs text-ds-muted-foreground mt-1">Referrals Sent</p>
              </div>
              <div className="border border-ds-border rounded-lg p-4 bg-ds-card text-center">
                <p className="text-2xl font-bold text-ds-foreground">{referralStats.accepted}</p>
                <p className="text-xs text-ds-muted-foreground mt-1">Accepted</p>
              </div>
              <div className="border border-ds-border rounded-lg p-4 bg-ds-card text-center">
                <p className="text-2xl font-bold text-ds-success">${referralStats.earned}</p>
                <p className="text-xs text-ds-muted-foreground mt-1">Total Earned</p>
              </div>
            </div>
          </div>

          {showLeaderboard && (
            <div className="border border-ds-border rounded-lg bg-ds-card overflow-hidden">
              <div className="px-5 py-4 border-b border-ds-border">
                <h3 className="text-sm font-semibold text-ds-foreground">Referral Leaderboard</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-ds-muted">
                    <th className="text-start text-xs font-medium text-ds-muted-foreground p-3 w-12">Rank</th>
                    <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Name</th>
                    <th className="text-end text-xs font-medium text-ds-muted-foreground p-3">Referrals</th>
                    <th className="text-end text-xs font-medium text-ds-muted-foreground p-3">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-t border-ds-border">
                      <td className="p-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          entry.rank === 1 ? 'bg-ds-warning/20 text-ds-warning' :
                          entry.rank === 2 ? 'bg-ds-muted text-ds-muted-foreground' :
                          entry.rank === 3 ? 'bg-ds-warning/10 text-ds-warning/70' :
                          'text-ds-muted-foreground'
                        }`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="p-3 text-sm font-medium text-ds-foreground">{entry.name}</td>
                      <td className="p-3 text-sm text-end text-ds-foreground">{entry.referrals}</td>
                      <td className="p-3 text-sm text-end font-semibold text-ds-success">{entry.earned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
