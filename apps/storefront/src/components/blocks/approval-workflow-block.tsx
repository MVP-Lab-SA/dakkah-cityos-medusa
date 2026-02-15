import React, { useState } from 'react'

interface ApprovalWorkflowBlockProps {
  showPending?: boolean
  showHistory?: boolean
  variant?: 'list' | 'kanban' | 'timeline'
}

const pendingApprovals = [
  { id: 'PO-847', item: 'Industrial Sensor Modules (x50)', requester: 'James Wilson', amount: 7499.50, date: 'Feb 10, 2026', priority: 'high' as const },
  { id: 'PO-846', item: 'Office Supplies Bundle', requester: 'Ahmed Hassan', amount: 342.00, date: 'Feb 9, 2026', priority: 'low' as const },
  { id: 'PO-844', item: 'Server Rack Equipment', requester: 'Sarah Chen', amount: 12500.00, date: 'Feb 8, 2026', priority: 'high' as const },
  { id: 'PO-842', item: 'Safety Equipment Set', requester: 'Maria Garcia', amount: 1850.00, date: 'Feb 7, 2026', priority: 'medium' as const },
]

const historyItems = [
  { id: 'PO-840', item: 'Network Switches (x10)', requester: 'James Wilson', amount: 4500.00, date: 'Feb 5, 2026', decision: 'approved' as const, decidedBy: 'Maria Garcia' },
  { id: 'PO-838', item: 'Marketing Materials', requester: 'Ahmed Hassan', amount: 890.00, date: 'Feb 3, 2026', decision: 'approved' as const, decidedBy: 'Sarah Chen' },
  { id: 'PO-835', item: 'Premium Software License', requester: 'Sarah Chen', amount: 15000.00, date: 'Feb 1, 2026', decision: 'rejected' as const, decidedBy: 'Maria Garcia' },
]

const timelineSteps = [
  { label: 'Submitted', status: 'completed' as const },
  { label: 'Under Review', status: 'current' as const },
  { label: 'Approved', status: 'pending' as const },
  { label: 'Fulfilled', status: 'pending' as const },
]

const priorityStyles: Record<string, string> = {
  high: 'bg-ds-destructive/10 text-ds-destructive',
  medium: 'bg-ds-warning/10 text-ds-warning',
  low: 'bg-ds-muted text-ds-muted-foreground',
}

export const ApprovalWorkflowBlock: React.FC<ApprovalWorkflowBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  showPending = true,
  showHistory = true,
  variant = 'list',
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>(showPending ? 'pending' : 'history')

  const StatusTimeline = () => (
    <div className="flex items-center gap-0 w-full max-w-md">
      {timelineSteps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                step.status === 'completed'
                  ? 'bg-ds-success text-ds-primary-foreground'
                  : step.status === 'current'
                  ? 'bg-ds-primary text-ds-primary-foreground'
                  : 'bg-ds-muted text-ds-muted-foreground'
              }`}
            >
              {step.status === 'completed' ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                idx + 1
              )}
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap ${
              step.status === 'pending' ? 'text-ds-muted-foreground' : 'text-ds-foreground'
            }`}>
              {step.label}
            </span>
          </div>
          {idx < timelineSteps.length - 1 && (
            <div className={`flex-1 h-0.5 mt-[-14px] ${
              step.status === 'completed' ? 'bg-ds-success' : 'bg-ds-muted'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  if (variant === 'kanban') {
    const columns = [
      { title: 'Submitted', items: pendingApprovals.slice(0, 1) },
      { title: 'Under Review', items: pendingApprovals.slice(1, 3) },
      { title: 'Approved', items: historyItems.filter(i => i.decision === 'approved').slice(0, 1) },
      { title: 'Fulfilled', items: historyItems.slice(1, 2) },
    ]

    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-8">
            Approval Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => (
              <div key={col.title} className="border border-ds-border rounded-lg bg-ds-muted/30">
                <div className="px-4 py-3 border-b border-ds-border">
                  <h3 className="text-sm font-semibold text-ds-foreground">{col.title}</h3>
                  <span className="text-xs text-ds-muted-foreground">{col.items.length} items</span>
                </div>
                <div className="p-3 space-y-3">
                  {col.items.map((item) => (
                    <div key={item.id} className="border border-ds-border rounded-md p-3 bg-ds-card shadow-sm">
                      <p className="text-xs font-mono text-ds-muted-foreground mb-1">{item.id}</p>
                      <p className="text-sm font-medium text-ds-foreground mb-2">{item.item}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-ds-muted-foreground">{item.requester}</span>
                        <span className="text-sm font-semibold text-ds-foreground">${item.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'timeline') {
    return (
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-8">
            Approval Workflow
          </h2>
          <div className="mb-8 flex justify-center">
            <StatusTimeline />
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="border border-ds-border rounded-lg p-4 bg-ds-card flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-ds-muted-foreground">{item.id}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full capitalize ${priorityStyles[item.priority]}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-ds-foreground">{item.item}</p>
                  <p className="text-xs text-ds-muted-foreground mt-0.5">
                    {item.requester} · {item.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-ds-foreground">${item.amount.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button type="button" className="px-3 py-1.5 text-xs font-medium rounded-md bg-ds-success text-ds-primary-foreground hover:opacity-90 transition-opacity">
                      Approve
                    </button>
                    <button type="button" className="px-3 py-1.5 text-xs font-medium rounded-md border border-ds-destructive text-ds-destructive hover:bg-ds-destructive/10 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground mb-6">
          Approval Workflow
        </h2>

        <div className="mb-6 flex justify-center">
          <StatusTimeline />
        </div>

        <div className="flex gap-2 mb-6">
          {showPending && (
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'pending'
                  ? 'bg-ds-primary text-ds-primary-foreground'
                  : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
              }`}
            >
              Pending ({pendingApprovals.length})
            </button>
          )}
          {showHistory && (
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-ds-primary text-ds-primary-foreground'
                  : 'bg-ds-muted text-ds-muted-foreground hover:text-ds-foreground'
              }`}
            >
              History
            </button>
          )}
        </div>

        {activeTab === 'pending' && (
          <div className="border border-ds-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-ds-muted">
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">ID</th>
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Item</th>
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Requester</th>
                  <th className="text-end text-xs font-medium text-ds-muted-foreground p-3">Amount</th>
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Date</th>
                  <th className="text-end text-xs font-medium text-ds-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((item) => (
                  <tr key={item.id} className="border-t border-ds-border hover:bg-ds-muted/30 transition-colors">
                    <td className="p-3 text-sm font-mono text-ds-muted-foreground">{item.id}</td>
                    <td className="p-3">
                      <span className="text-sm text-ds-foreground">{item.item}</span>
                      <span className={`ms-2 px-1.5 py-0.5 text-[10px] font-medium rounded-full capitalize ${priorityStyles[item.priority]}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-ds-foreground">{item.requester}</td>
                    <td className="p-3 text-sm text-end font-semibold text-ds-foreground">${item.amount.toLocaleString()}</td>
                    <td className="p-3 text-sm text-ds-muted-foreground">{item.date}</td>
                    <td className="p-3 text-end">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="px-3 py-1 text-xs font-medium rounded-md bg-ds-success text-ds-primary-foreground hover:opacity-90 transition-opacity">
                          Approve
                        </button>
                        <button type="button" className="px-3 py-1 text-xs font-medium rounded-md border border-ds-destructive text-ds-destructive hover:bg-ds-destructive/10 transition-colors">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="border border-ds-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-ds-muted">
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">ID</th>
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Item</th>
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Requester</th>
                  <th className="text-end text-xs font-medium text-ds-muted-foreground p-3">Amount</th>
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Decision</th>
                  <th className="text-start text-xs font-medium text-ds-muted-foreground p-3">Decided By</th>
                </tr>
              </thead>
              <tbody>
                {historyItems.map((item) => (
                  <tr key={item.id} className="border-t border-ds-border">
                    <td className="p-3 text-sm font-mono text-ds-muted-foreground">{item.id}</td>
                    <td className="p-3 text-sm text-ds-foreground">{item.item}</td>
                    <td className="p-3 text-sm text-ds-foreground">{item.requester}</td>
                    <td className="p-3 text-sm text-end font-semibold text-ds-foreground">${item.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                        item.decision === 'approved'
                          ? 'bg-ds-success/10 text-ds-success'
                          : 'bg-ds-destructive/10 text-ds-destructive'
                      }`}>
                        {item.decision}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-ds-muted-foreground">{item.decidedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
