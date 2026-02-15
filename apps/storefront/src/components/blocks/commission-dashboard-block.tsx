import React from 'react'

interface CommissionDashboardBlockProps {
  vendorId?: string
  period?: 'week' | 'month' | 'quarter' | 'year'
  showChart?: boolean
}

export const CommissionDashboardBlock: React.FC<CommissionDashboardBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  vendorId,
  period = 'month',
  showChart = true,
}) => {
  const [activePeriod, setActivePeriod] = React.useState(period)

  const periods = [
    { label: 'Week', value: 'week' as const },
    { label: 'Month', value: 'month' as const },
    { label: 'Quarter', value: 'quarter' as const },
    { label: 'Year', value: 'year' as const },
  ]

  const summaryCards = [
    { label: 'Gross Revenue', value: '$12,450.00', change: '+12.5%', positive: true },
    { label: 'Commission', value: '$1,867.50', change: '+8.2%', positive: true },
    { label: 'Net Earnings', value: '$10,582.50', change: '+14.1%', positive: true },
    { label: 'Pending Payout', value: '$3,240.00', change: '', positive: true },
  ]

  const recentTransactions = [
    { id: 'TXN-001', date: 'Feb 12, 2026', order: '#ORD-847', amount: 149.99, commission: 22.50, status: 'completed' },
    { id: 'TXN-002', date: 'Feb 11, 2026', order: '#ORD-846', amount: 89.99, commission: 13.50, status: 'completed' },
    { id: 'TXN-003', date: 'Feb 11, 2026', order: '#ORD-845', amount: 249.99, commission: 37.50, status: 'pending' },
    { id: 'TXN-004', date: 'Feb 10, 2026', order: '#ORD-844', amount: 59.99, commission: 9.00, status: 'completed' },
    { id: 'TXN-005', date: 'Feb 10, 2026', order: '#ORD-843', amount: 199.99, commission: 30.00, status: 'completed' },
  ]

  const chartBars = [65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95, 70]

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground">Commission Dashboard</h2>
          <div className="flex gap-1 bg-ds-muted rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setActivePeriod(p.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activePeriod === p.value
                    ? 'bg-ds-background text-ds-foreground shadow-sm'
                    : 'text-ds-muted-foreground hover:text-ds-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-ds-card border border-ds-border rounded-lg p-5">
              <p className="text-sm text-ds-muted-foreground mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-ds-foreground">{card.value}</p>
              {card.change && (
                <p className={`text-sm mt-1 ${card.positive ? 'text-ds-primary' : 'text-ds-destructive'}`}>
                  {card.change}
                </p>
              )}
            </div>
          ))}
        </div>

        {showChart && (
          <div className="bg-ds-card border border-ds-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-ds-foreground mb-6">Revenue Overview</h3>
            <div className="flex items-end gap-2 h-48">
              {chartBars.map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-ds-primary/20 rounded-t-sm relative group cursor-pointer"
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className="absolute bottom-0 w-full bg-ds-primary rounded-t-sm transition-all"
                      style={{ height: `${height * 0.7}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-ds-muted-foreground">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-ds-border">
            <h3 className="text-lg font-semibold text-ds-foreground">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ds-border">
                  <th className="text-left text-xs font-medium text-ds-muted-foreground px-4 py-3">Transaction</th>
                  <th className="text-left text-xs font-medium text-ds-muted-foreground px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-ds-muted-foreground px-4 py-3">Order</th>
                  <th className="text-right text-xs font-medium text-ds-muted-foreground px-4 py-3">Amount</th>
                  <th className="text-right text-xs font-medium text-ds-muted-foreground px-4 py-3">Commission</th>
                  <th className="text-left text-xs font-medium text-ds-muted-foreground px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-ds-border last:border-0 hover:bg-ds-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-ds-foreground">{tx.id}</td>
                    <td className="px-4 py-3 text-sm text-ds-muted-foreground">{tx.date}</td>
                    <td className="px-4 py-3 text-sm text-ds-primary">{tx.order}</td>
                    <td className="px-4 py-3 text-sm text-ds-foreground text-right">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-ds-muted-foreground text-right">${tx.commission.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'completed'
                          ? 'bg-ds-primary/10 text-ds-primary'
                          : 'bg-ds-warning/15 text-ds-warning'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
