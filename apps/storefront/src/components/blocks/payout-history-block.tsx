import React from 'react'

interface PayoutHistoryBlockProps {
  vendorId?: string
  limit?: number
  showFilters?: boolean
  columns?: string[]
}

export const PayoutHistoryBlock: React.FC<PayoutHistoryBlockProps> = ({
  vendorId,
  limit = 10,
  showFilters = true,
  columns = ['date', 'amount', 'status', 'method'],
}) => {
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [currentPage, setCurrentPage] = React.useState(1)

  const statusOptions = ['All', 'Completed', 'Pending', 'Processing', 'Failed']

  const placeholderPayouts = [
    { id: 'PAY-001', date: 'Feb 10, 2026', amount: 2450.00, status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-002', date: 'Feb 03, 2026', amount: 1890.50, status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-003', date: 'Jan 27, 2026', amount: 3120.75, status: 'completed', method: 'PayPal' },
    { id: 'PAY-004', date: 'Jan 20, 2026', amount: 980.00, status: 'processing', method: 'Bank Transfer' },
    { id: 'PAY-005', date: 'Jan 13, 2026', amount: 2100.25, status: 'completed', method: 'Stripe' },
    { id: 'PAY-006', date: 'Jan 06, 2026', amount: 1560.00, status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-007', date: 'Dec 30, 2025', amount: 890.50, status: 'failed', method: 'PayPal' },
    { id: 'PAY-008', date: 'Dec 23, 2025', amount: 2780.00, status: 'completed', method: 'Bank Transfer' },
  ]

  const statusColors: Record<string, string> = {
    completed: 'bg-ds-primary/10 text-ds-primary',
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    failed: 'bg-ds-destructive/10 text-ds-destructive',
  }

  const totalPages = 3

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground">Payout History</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ds-muted-foreground">Total Paid:</span>
            <span className="text-lg font-bold text-ds-foreground">$15,772.00</span>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status.toLowerCase())}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status.toLowerCase()
                      ? 'bg-ds-primary text-ds-primary-foreground'
                      : 'bg-ds-muted text-ds-foreground hover:bg-ds-muted/80'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <input
                type="date"
                className="px-3 py-1.5 rounded-md border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
              <input
                type="date"
                className="px-3 py-1.5 rounded-md border border-ds-border bg-ds-background text-ds-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>
          </div>
        )}

        <div className="bg-ds-card border border-ds-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ds-border bg-ds-muted/50">
                  <th className="text-left text-xs font-medium text-ds-muted-foreground px-4 py-3">Payout ID</th>
                  {columns.includes('date') && (
                    <th className="text-left text-xs font-medium text-ds-muted-foreground px-4 py-3">Date</th>
                  )}
                  {columns.includes('amount') && (
                    <th className="text-right text-xs font-medium text-ds-muted-foreground px-4 py-3">Amount</th>
                  )}
                  {columns.includes('status') && (
                    <th className="text-left text-xs font-medium text-ds-muted-foreground px-4 py-3">Status</th>
                  )}
                  {columns.includes('method') && (
                    <th className="text-left text-xs font-medium text-ds-muted-foreground px-4 py-3">Method</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {placeholderPayouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-ds-border last:border-0 hover:bg-ds-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-ds-foreground">{payout.id}</td>
                    {columns.includes('date') && (
                      <td className="px-4 py-3 text-sm text-ds-muted-foreground">{payout.date}</td>
                    )}
                    {columns.includes('amount') && (
                      <td className="px-4 py-3 text-sm font-semibold text-ds-foreground text-right">
                        ${payout.amount.toFixed(2)}
                      </td>
                    )}
                    {columns.includes('status') && (
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[payout.status] || ''}`}>
                          {payout.status}
                        </span>
                      </td>
                    )}
                    {columns.includes('method') && (
                      <td className="px-4 py-3 text-sm text-ds-muted-foreground">{payout.method}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-ds-border">
            <p className="text-sm text-ds-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  currentPage === 1
                    ? 'text-ds-muted-foreground cursor-not-allowed'
                    : 'border border-ds-border text-ds-foreground hover:bg-ds-muted'
                }`}
              >
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-ds-primary text-ds-primary-foreground'
                      : 'border border-ds-border text-ds-foreground hover:bg-ds-muted'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  currentPage === totalPages
                    ? 'text-ds-muted-foreground cursor-not-allowed'
                    : 'border border-ds-border text-ds-foreground hover:bg-ds-muted'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
