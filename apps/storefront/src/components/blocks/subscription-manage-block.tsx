import React from 'react'

interface SubscriptionManageBlockProps {
  subscriptionId?: string
  showUsage?: boolean
  allowPause?: boolean
  allowUpgrade?: boolean
}

interface BillingRecord {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  invoice?: string
}

const billingHistory: BillingRecord[] = [
  { id: '1', date: 'Feb 1, 2026', amount: 29, status: 'paid', invoice: 'INV-2026-002' },
  { id: '2', date: 'Jan 1, 2026', amount: 29, status: 'paid', invoice: 'INV-2026-001' },
  { id: '3', date: 'Dec 1, 2025', amount: 29, status: 'paid', invoice: 'INV-2025-012' },
  { id: '4', date: 'Nov 1, 2025', amount: 29, status: 'paid', invoice: 'INV-2025-011' },
  { id: '5', date: 'Oct 1, 2025', amount: 29, status: 'paid', invoice: 'INV-2025-010' },
]

const usageData = {
  bookings: { used: 42, limit: 100, label: 'Bookings' },
  storage: { used: 3.2, limit: 10, label: 'Storage (GB)' },
  users: { used: 3, limit: 5, label: 'Team Members' },
  apiCalls: { used: 8500, limit: 50000, label: 'API Calls' },
}

export const SubscriptionManageBlock: React.FC<SubscriptionManageBlockProps> = ({
  subscriptionId,
  showUsage = true,
  allowPause = true,
  allowUpgrade = true,
}) => {
  const [isPaused, setIsPaused] = React.useState(false)
  const [showCancelModal, setShowCancelModal] = React.useState(false)

  const getUsagePercent = (used: number, limit: number) => Math.round((used / limit) * 100)
  const getUsageColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= 70) return 'bg-yellow-500'
    return 'bg-ds-primary'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-ds-muted text-ds-muted-foreground'
    }
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-ds-card border border-ds-border rounded-xl p-6 md:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-ds-foreground">Professional Plan</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isPaused ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {isPaused ? 'Paused' : 'Active'}
                  </span>
                </div>
                <p className="text-sm text-ds-muted-foreground">
                  Billed monthly · Next billing: March 1, 2026
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-ds-foreground">$29</p>
                <p className="text-sm text-ds-muted-foreground">/month</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-ds-border">
              {allowPause && (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isPaused
                      ? 'bg-ds-primary text-ds-primary-foreground hover:opacity-90'
                      : 'border border-ds-border text-ds-foreground hover:bg-ds-muted'
                  }`}
                >
                  {isPaused ? 'Resume Subscription' : 'Pause Subscription'}
                </button>
              )}

              {allowUpgrade && (
                <button className="px-5 py-2.5 bg-ds-primary text-ds-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  Upgrade Plan
                </button>
              )}

              <button
                onClick={() => setShowCancelModal(!showCancelModal)}
                className="px-5 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {showCancelModal && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Cancel Subscription?</h3>
              <p className="text-sm text-red-600 mb-4">
                Your subscription will remain active until March 1, 2026. After that, you'll lose access to Professional features.
              </p>
              <div className="flex gap-3">
                <button className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                  Confirm Cancellation
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-5 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          )}

          {showUsage && (
            <div className="bg-ds-card border border-ds-border rounded-xl p-6 md:p-8 mb-6">
              <h3 className="text-lg font-semibold text-ds-foreground mb-6">Usage This Period</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(usageData).map(([key, data]) => {
                  const percent = getUsagePercent(data.used, data.limit)
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-ds-foreground">{data.label}</span>
                        <span className="text-sm text-ds-muted-foreground">
                          {typeof data.used === 'number' && data.used % 1 !== 0 ? data.used.toFixed(1) : data.used.toLocaleString()} / {data.limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-ds-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getUsageColor(percent)}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      {percent >= 80 && (
                        <p className="text-xs text-yellow-600 mt-1">
                          {percent >= 90 ? 'Almost at limit!' : 'Approaching limit'}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="bg-ds-card border border-ds-border rounded-xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-ds-foreground mb-6">Billing History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ds-border">
                    <th className="text-left p-3 text-sm font-medium text-ds-muted-foreground">Date</th>
                    <th className="text-left p-3 text-sm font-medium text-ds-muted-foreground">Invoice</th>
                    <th className="text-left p-3 text-sm font-medium text-ds-muted-foreground">Amount</th>
                    <th className="text-left p-3 text-sm font-medium text-ds-muted-foreground">Status</th>
                    <th className="text-right p-3 text-sm font-medium text-ds-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((record) => (
                    <tr key={record.id} className="border-b border-ds-border last:border-0">
                      <td className="p-3 text-sm text-ds-foreground">{record.date}</td>
                      <td className="p-3 text-sm text-ds-foreground font-mono">{record.invoice}</td>
                      <td className="p-3 text-sm text-ds-foreground font-medium">${record.amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-sm text-ds-primary hover:underline">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
